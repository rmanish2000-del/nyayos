#!/usr/bin/env node
/**
 * NyayOS repository-centric AI operating system — state generator and validator (A-044).
 *
 * The files under docs/ai/ let any tool (Claude Code, Figma, Lovable, Gemini, M365 Copilot) pick up
 * the project from the repository alone:
 *
 *   docs/ai/CURRENT_STATE.json   where the project is; the last completed assignment and its handoff
 *   docs/ai/NEXT_TASK.json       the recommended next assignment
 *   docs/ai/DECISIONS.json       founder decisions (logged, candidate, ruled in a brief)
 *   docs/ai/RISKS.json           product risks from the risk register, plus engineering residuals
 *   docs/ai/tool-output/<tool>/  one handoff per assignment, per tool
 *
 * Some fields are DERIVED from the governance sources and regenerated here; the rest are maintained
 * by the tool that completes an assignment and are cross-checked.
 *
 * Usage:
 *   node scripts/ai/state.mjs generate   rewrite the derived fields from their sources
 *   node scripts/ai/state.mjs check      validate everything (CI: task-gate); exit 1 on any finding
 *
 * No dependencies. Node >= 18. Git is used to prove recorded commits are in the checked-out history.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const AI = "docs/ai";
const FILES = {
  current: `${AI}/CURRENT_STATE.json`,
  next: `${AI}/NEXT_TASK.json`,
  decisions: `${AI}/DECISIONS.json`,
  risks: `${AI}/RISKS.json`,
};
const SCHEMAS = {
  current: `${AI}/schemas/current_state.schema.json`,
  next: `${AI}/schemas/next_task.schema.json`,
  decisions: `${AI}/schemas/decisions.schema.json`,
  risks: `${AI}/schemas/risks.schema.json`,
};
const TOOLS = ["claude-code", "figma", "lovable", "gemini"];
const SOURCES = {
  registry: "docs/founder/NYAYOS_STATUS_REGISTRY.json",
  decisionLog: "docs/founder/NYAYOS_DECISION_LOG_V1.md",
  candidateDecisions: "docs/architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md",
  riskRegister: "docs/founder/NYAYOS_RISK_REGISTER_V1.md",
  status: "NYAYOS_STATUS.json",
};
const HANDOFF_FIELDS = ["Assignment", "Tool", "Status", "Branch", "Baseline", "Commit", "Pushed"];
const HANDOFF_SECTIONS = ["Result", "Evidence", "Limitations", "Next"];
const ID_RE = /^A-(\d{3})(-R(\d?))?$/;
const SHA_RE = /^[0-9a-f]{40}$/;

const abs = (p) => resolve(ROOT, p);
const readText = (p) => readFileSync(abs(p), "utf8");
const readJson = (p) => JSON.parse(readText(p));
const writeJson = (p, v) => writeFileSync(abs(p), JSON.stringify(v, null, 2) + "\n", "utf8");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------------------------------------------------------------------------
// Minimal JSON Schema validator (the subset the docs/ai schemas use)
// ---------------------------------------------------------------------------
function validateSchema(value, schema, root = schema, path = "$") {
  const errors = [];
  if (schema.$ref) {
    const name = schema.$ref.replace(/^#\/\$defs\//, "");
    const target = root.$defs?.[name];
    if (!target) return [`${path}: unresolved $ref ${schema.$ref}`];
    return validateSchema(value, target, root, path);
  }
  const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : Number.isInteger(v) ? "integer" : typeof v);
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const t = typeOf(value);
    const ok = types.some((x) => x === t || (x === "number" && (t === "number" || t === "integer")));
    if (!ok) return [`${path}: expected ${types.join("|")}, got ${t}`];
  }
  if ("const" in schema && !same(value, schema.const)) errors.push(`${path}: must equal ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.some((e) => same(e, value))) errors.push(`${path}: ${JSON.stringify(value)} not in ${JSON.stringify(schema.enum)}`);
  if (typeof value === "string") {
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${path}: "${value}" does not match ${schema.pattern}`);
    if (schema.minLength && value.length < schema.minLength) errors.push(`${path}: shorter than ${schema.minLength}`);
  }
  if (typeof value === "number" && "minimum" in schema && value < schema.minimum) errors.push(`${path}: below ${schema.minimum}`);
  if (Array.isArray(value)) {
    if (schema.minItems && value.length < schema.minItems) errors.push(`${path}: fewer than ${schema.minItems} items`);
    if (schema.items) value.forEach((v, i) => errors.push(...validateSchema(v, schema.items, root, `${path}[${i}]`)));
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const k of schema.required ?? []) if (!(k in value)) errors.push(`${path}: missing required "${k}"`);
    for (const [k, v] of Object.entries(value)) {
      if (schema.properties?.[k]) errors.push(...validateSchema(v, schema.properties[k], root, `${path}.${k}`));
      else if (schema.additionalProperties === false) errors.push(`${path}: unexpected property "${k}"`);
      else if (typeof schema.additionalProperties === "object") errors.push(...validateSchema(v, schema.additionalProperties, root, `${path}.${k}`));
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// Derivations from the governance sources
// ---------------------------------------------------------------------------
function idKey(id) {
  const m = ID_RE.exec(id);
  if (!m) return null;
  return [Number(m[1]), m[2] ? 1 : 0, m[3] ? Number(m[3]) : 0];
}
function compareIds(a, b) {
  const x = idKey(a), y = idKey(b);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
}

function deriveRegistry() {
  const reg = readJson(SOURCES.registry);
  const tasks = reg.tasks;
  const ids = tasks.map((t) => t.id).sort(compareIds);
  const byStatus = {};
  for (const s of ["OPEN", "IN_PROGRESS", "REVIEW", "CANONICAL", "SUPERSEDED"]) byStatus[s] = tasks.filter((t) => t.status === s).length;
  const list = (s) => tasks.filter((t) => t.status === s).map((t) => t.id).sort(compareIds);
  return {
    source: SOURCES.registry,
    registry_updated: reg.updated ?? null,
    task_count: tasks.length,
    by_status: byStatus,
    highest_task_id: ids[ids.length - 1],
    open_tasks: list("OPEN"),
    in_progress_tasks: list("IN_PROGRESS"),
    review_tasks: list("REVIEW"),
  };
}

function deriveLoggedDecisions() {
  const text = readText(SOURCES.decisionLog);
  const out = [];
  const re = /^## (D-\d{3}) — (.+)$/gm;
  let m;
  const heads = [];
  while ((m = re.exec(text))) heads.push({ id: m[1], title: m[2].trim(), at: m.index });
  for (const h of heads) {
    const nextHeading = text.indexOf("\n## ", h.at + 3);
    const body = text.slice(h.at, nextHeading > 0 ? nextHeading : text.length);
    const st = /\*\*Status:\*\*\s*([^.\n]+)/.exec(body);
    out.push({ id: h.id, title: h.title, log_status: st ? st[1].replace(/\*/g, "").trim() : null });
  }
  return out;
}

function deriveCandidateDecisions() {
  const text = readText(SOURCES.candidateDecisions);
  const start = text.indexOf("## 9. Decisions required before wave W1");
  const end = text.indexOf("\n## ", start + 5);
  const section = text.slice(start, end);
  const out = [];
  for (const m of section.matchAll(/^\| (D-\d{3}) \| (.+) \|$/gm)) out.push({ id: m[1], question: m[2].trim() });
  return out;
}

function deriveRisks() {
  const text = readText(SOURCES.riskRegister);
  const risks = [];
  for (const m of text.matchAll(/^\| (R\d{2}) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)) {
    risks.push({ id: m[1], risk: m[2].trim(), severity: m[3].trim(), likelihood: m[4].trim(), control: m[5].trim(), trigger: m[6].trim() });
  }
  const topStart = text.indexOf("## Top five");
  const topEnd = text.indexOf("\n## ", topStart + 5);
  const top = [...text.slice(topStart, topEnd).matchAll(/^### \d+\. (.+)$/gm)].map((m) => m[1].trim());
  return { risks, top_five: top };
}

function derived() {
  return {
    current: deriveRegistry(),
    logged: deriveLoggedDecisions(),
    candidates: deriveCandidateDecisions(),
    risks: deriveRisks(),
  };
}

// ---------------------------------------------------------------------------
// generate
// ---------------------------------------------------------------------------
function generate() {
  const d = derived();
  const cur = readJson(FILES.current);
  cur.derived = d.current;
  writeJson(FILES.current, cur);
  const dec = readJson(FILES.decisions);
  dec.logged = d.logged;
  dec.candidates = d.candidates;
  writeJson(FILES.decisions, dec);
  const rk = readJson(FILES.risks);
  rk.risks = d.risks.risks;
  rk.top_five = d.risks.top_five;
  writeJson(FILES.risks, rk);
  console.log(`generated: ${FILES.current} (derived), ${FILES.decisions} (logged, candidates), ${FILES.risks} (risks, top_five)`);
}

// ---------------------------------------------------------------------------
// check
// ---------------------------------------------------------------------------
function git(args) {
  try {
    return { ok: true, out: execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() };
  } catch (e) {
    return { ok: false, out: String(e.stderr ?? e.message).trim() };
  }
}

function parseHandoff(path) {
  const text = readText(path);
  const fields = {};
  for (const f of HANDOFF_FIELDS) {
    const m = new RegExp(`^\\*\\*${f}:\\*\\*\\s*(.+)$`, "m").exec(text);
    fields[f] = m ? m[1].trim().replace(/`/g, "") : null;
  }
  const sections = HANDOFF_SECTIONS.filter((s) => new RegExp(`^## ${s}\\s*$`, "m").test(text));
  return { text, fields, sections };
}

function check() {
  const findings = [];
  const add = (f) => findings.push(f);

  // 1. files exist
  const required = [...Object.values(FILES), ...Object.values(SCHEMAS), `${AI}/README.md`,
    ...TOOLS.map((t) => `${AI}/tool-output/${t}/README.md`), ...Object.values(SOURCES)];
  for (const p of required) if (!existsSync(abs(p))) add(`missing file ${p}`);
  if (findings.length) return findings;

  // 2. JSON parses and matches its schema
  const docs = {};
  for (const [k, p] of Object.entries(FILES)) {
    try {
      docs[k] = readJson(p);
    } catch (e) {
      add(`${p}: invalid JSON (${e.message})`);
      continue;
    }
    const schema = readJson(SCHEMAS[k]);
    for (const err of validateSchema(docs[k], schema)) add(`${p}: schema: ${err}`);
  }
  if (findings.length) return findings;
  const { current: cur, next, decisions: dec, risks: rk } = docs;

  // 3. generated fields are in sync with their sources
  const d = derived();
  if (!same(cur.derived, d.current)) add(`${FILES.current}: "derived" is stale against ${SOURCES.registry} — run: node scripts/ai/state.mjs generate`);
  if (!same(dec.logged, d.logged)) add(`${FILES.decisions}: "logged" is stale against ${SOURCES.decisionLog} — run generate`);
  if (!same(dec.candidates, d.candidates)) add(`${FILES.decisions}: "candidates" is stale against ${SOURCES.candidateDecisions} §9 — run generate`);
  if (!same(rk.risks, d.risks.risks) || !same(rk.top_five, d.risks.top_five)) add(`${FILES.risks}: "risks"/"top_five" stale against ${SOURCES.riskRegister} — run generate`);

  // 4. the last assignment is recorded: CURRENT_STATE, handoff and NEXT_TASK all follow the newest registered task
  const reg = readJson(SOURCES.registry);
  const task = reg.tasks.find((t) => t.id === cur.last_assignment.id);
  if (cur.last_assignment.id !== d.current.highest_task_id) {
    add(`assignment state not recorded: the registry's newest task is ${d.current.highest_task_id} but ${FILES.current} records ${cur.last_assignment.id}. ` +
      "After commit and push, update CURRENT_STATE, the tool handoff and NEXT_TASK (docs/ai/README.md).");
  }
  if (!task) add(`${FILES.current}: last_assignment ${cur.last_assignment.id} is not in the registry`);
  else {
    if (task.status !== cur.last_assignment.status) add(`${FILES.current}: last_assignment.status ${cur.last_assignment.status} ≠ registry ${task.status}`);
    if (task.title !== cur.last_assignment.title) add(`${FILES.current}: last_assignment.title differs from the registry title`);
  }
  const commit = cur.last_assignment.commit;
  const inHistory = git(["merge-base", "--is-ancestor", commit, "HEAD"]);
  if (!inHistory.ok) add(`${FILES.current}: last_assignment.commit ${commit} is not in the checked-out history (commit and push before recording state)`);
  const baseOk = git(["merge-base", "--is-ancestor", cur.last_assignment.baseline, commit]);
  if (!baseOk.ok) add(`${FILES.current}: last_assignment.baseline is not an ancestor of last_assignment.commit`);

  const h = cur.last_assignment.handoff;
  const expected = `${AI}/tool-output/${cur.last_assignment.tool}/${cur.last_assignment.id}.md`;
  if (h !== expected) add(`${FILES.current}: last_assignment.handoff must be ${expected}`);
  if (!existsSync(abs(h))) add(`missing handoff ${h}`);

  // every handoff file (all tools) is well formed; the last one matches CURRENT_STATE
  const regIds = new Set(reg.tasks.map((t) => t.id));
  for (const tool of TOOLS) {
    const dir = `${AI}/tool-output/${tool}`;
    for (const f of readdirSync(abs(dir)).filter((x) => x.endsWith(".md") && x !== "README.md")) {
      const p = `${dir}/${f}`;
      const id = basename(f, ".md");
      if (!ID_RE.test(id)) { add(`${p}: file name must be an assignment ID (A-nnn.md)`); continue; }
      if (!regIds.has(id)) add(`${p}: ${id} is not in the registry`);
      const { fields, sections } = parseHandoff(p);
      for (const fld of HANDOFF_FIELDS) if (!fields[fld]) add(`${p}: missing **${fld}:** line`);
      for (const s of HANDOFF_SECTIONS) if (!sections.includes(s)) add(`${p}: missing "## ${s}" section`);
      if (fields.Assignment && fields.Assignment !== id) add(`${p}: Assignment ${fields.Assignment} ≠ file name ${id}`);
      if (fields.Tool && fields.Tool !== tool) add(`${p}: Tool ${fields.Tool} ≠ directory ${tool}`);
      if (fields.Commit && !SHA_RE.test(fields.Commit)) add(`${p}: Commit must be a full 40-character SHA`);
      if (fields.Baseline && !SHA_RE.test(fields.Baseline)) add(`${p}: Baseline must be a full 40-character SHA`);
      if (fields.Pushed && fields.Pushed !== "yes") add(`${p}: Pushed must be "yes" (push before writing the handoff)`);
      if (p === h) {
        if (fields.Commit !== commit) add(`${p}: Commit ≠ CURRENT_STATE last_assignment.commit`);
        if (fields.Baseline !== cur.last_assignment.baseline) add(`${p}: Baseline ≠ CURRENT_STATE last_assignment.baseline`);
        if (fields.Status !== cur.last_assignment.status) add(`${p}: Status ≠ CURRENT_STATE last_assignment.status`);
        if (fields.Branch !== cur.working_branch) add(`${p}: Branch ≠ CURRENT_STATE working_branch`);
      }
    }
  }

  // 5. NEXT_TASK follows the last assignment and recommends an unregistered ID
  if (next.after !== cur.last_assignment.id) add(`${FILES.next}: "after" is ${next.after}; must be ${cur.last_assignment.id} (update NEXT_TASK with every assignment)`);
  if (next.recommended.id && regIds.has(next.recommended.id)) add(`${FILES.next}: recommended.id ${next.recommended.id} is already registered`);

  // 6. cross-file consistency
  const status = readJson(SOURCES.status);
  if (!(status.feature_branches ?? []).some((b) => b.name === cur.working_branch)) add(`${FILES.current}: working_branch ${cur.working_branch} is not listed in ${SOURCES.status} feature_branches`);
  const decIds = new Set([...dec.logged.map((x) => x.id), ...dec.candidates.map((x) => x.id)]);
  for (const r of dec.rulings) if (!decIds.has(r.id)) add(`${FILES.decisions}: ruling ${r.id} is neither logged nor a candidate`);
  const riskIds = new Set(rk.residuals.map((r) => r.id));
  for (const o of cur.open_items) if (o.risk && !riskIds.has(o.risk)) add(`${FILES.current}: open item ${o.id} cites unknown residual ${o.risk}`);
  for (const o of cur.open_items) if (o.decision && !decIds.has(o.decision)) add(`${FILES.current}: open item ${o.id} cites unknown decision ${o.decision}`);
  return findings;
}

// ---------------------------------------------------------------------------
const cmd = process.argv[2];
if (cmd === "generate") generate();
else if (cmd === "check") {
  const f = check();
  if (f.length) {
    console.error(`ai-state: ${f.length} finding(s)`);
    for (const x of f) console.error(`  ✗ ${x}`);
    process.exit(1);
  }
  const cur = readJson(FILES.current);
  console.log(`ai-state: clean — last assignment ${cur.last_assignment.id} recorded (commit ${cur.last_assignment.commit.slice(0, 7)}, handoff ${cur.last_assignment.handoff}); NEXT_TASK follows it; derived fields in sync`);
} else {
  console.error("usage: node scripts/ai/state.mjs generate|check");
  process.exit(2);
}
