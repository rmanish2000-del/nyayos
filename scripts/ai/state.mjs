#!/usr/bin/env node
/**
 * NyayOS repository-centric AI operating system — state generator and validator (A-044).
 *
 * Any tool (Claude Code, Figma, Lovable, Gemini) and M365 Copilot picks up the project from the
 * repository alone — no founder copy/paste:
 *
 *   docs/ai/STATUS_SUMMARY.md    GENERATED one-page summary: read this first
 *   docs/ai/CURRENT_STATE.json   where the project is; the last completed assignment and its handoff
 *   docs/ai/NEXT_TASK.json       the recommended next assignment
 *   docs/ai/DECISIONS.json       founder decisions (logged, candidate, ruled in a brief)
 *   docs/ai/RISKS.json           product risks from the risk register, plus engineering residuals
 *   docs/ai/tool-output/<tool>/  one handoff per assignment, per tool (contract: TOOL_OUTPUT_CONTRACT.md)
 *
 * Usage:
 *   node scripts/ai/state.mjs generate            rewrite derived fields and STATUS_SUMMARY.md
 *   node scripts/ai/state.mjs check               validate everything; exit 1 on any finding
 *   node scripts/ai/state.mjs check --head <sha>  also require that nothing but state files changed
 *                                                 after the recorded commit up to <sha> (CI, pull requests)
 *
 * No dependencies. Node >= 18. Git proves that recorded commits are in the checked-out history.
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
const SUMMARY = `${AI}/STATUS_SUMMARY.md`;
const SCHEMAS = {
  current: `${AI}/schemas/current_state.schema.json`,
  next: `${AI}/schemas/next_task.schema.json`,
  decisions: `${AI}/schemas/decisions.schema.json`,
  risks: `${AI}/schemas/risks.schema.json`,
  handoff: `${AI}/schemas/handoff.schema.json`,
};
const DOCS = [`${AI}/README.md`, `${AI}/TOOL_OUTPUT_CONTRACT.md`];
const TOOLS = ["claude-code", "figma", "lovable", "gemini"];
const SOURCES = {
  registry: "docs/founder/NYAYOS_STATUS_REGISTRY.json",
  decisionLog: "docs/founder/NYAYOS_DECISION_LOG_V1.md",
  candidateDecisions: "docs/architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md",
  riskRegister: "docs/founder/NYAYOS_RISK_REGISTER_V1.md",
  status: "NYAYOS_STATUS.json",
};
// Paths that may change after the recorded commit: the state commit itself, and the documents the
// status-update workflow regenerates from the registry on main.
const STATE_PATHS = [
  /^docs\/ai\/CURRENT_STATE\.json$/,
  /^docs\/ai\/NEXT_TASK\.json$/,
  /^docs\/ai\/STATUS_SUMMARY\.md$/,
  /^docs\/ai\/tool-output\/(claude-code|figma|lovable|gemini)\/[^/]+\.md$/,
  /^docs\/founder\/NYAYOS_(STATUS_REGISTRY\.md|DEPENDENCY_GRAPH\.md|STATUS_DASHBOARD\.md|CHANGELOG\.md)$/,
];
const HANDOFF_FIELDS = ["Assignment", "Tool", "Status", "Branch", "Baseline", "Commit", "Pushed", "Deployment"];
const HANDOFF_SECTIONS = ["Result", "Evidence", "Limitations", "Next"];
const ID_RE = /^A-(\d{3})(-R(\d?))?$/;

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
  return m ? [Number(m[1]), m[2] ? 1 : 0, m[3] ? Number(m[3]) : 0] : [0, 0, 0];
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
  const heads = [...text.matchAll(/^## (D-\d{3}) — (.+)$/gm)].map((m) => ({ id: m[1], title: m[2].trim(), at: m.index }));
  return heads.map((h) => {
    const nextHeading = text.indexOf("\n## ", h.at + 3);
    const body = text.slice(h.at, nextHeading > 0 ? nextHeading : text.length);
    const st = /\*\*Status:\*\*\s*([^.\n]+)/.exec(body);
    return { id: h.id, title: h.title, log_status: st ? st[1].replace(/\*/g, "").trim() : null };
  });
}

function deriveCandidateDecisions() {
  const text = readText(SOURCES.candidateDecisions);
  const start = text.indexOf("## 9. Decisions required before wave W1");
  const section = text.slice(start, text.indexOf("\n## ", start + 5));
  return [...section.matchAll(/^\| (D-\d{3}) \| (.+) \|$/gm)].map((m) => ({ id: m[1], question: m[2].trim() }));
}

function deriveRisks() {
  const text = readText(SOURCES.riskRegister);
  const risks = [...text.matchAll(/^\| (R\d{2}) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)].map((m) => ({
    id: m[1], risk: m[2].trim(), severity: m[3].trim(), likelihood: m[4].trim(), control: m[5].trim(), trigger: m[6].trim(),
  }));
  const topStart = text.indexOf("## Top five");
  const top = [...text.slice(topStart, text.indexOf("\n## ", topStart + 5)).matchAll(/^### \d+\. (.+)$/gm)].map((m) => m[1].trim());
  return { risks, top_five: top };
}

function derived() {
  return { current: deriveRegistry(), logged: deriveLoggedDecisions(), candidates: deriveCandidateDecisions(), risks: deriveRisks() };
}

// ---------------------------------------------------------------------------
// Handoffs
// ---------------------------------------------------------------------------
function parseHandoff(path) {
  const text = readText(path);
  const field = (f) => {
    const m = new RegExp(`^\\*\\*${f}:\\*\\*\\s*(.+)$`, "m").exec(text);
    return m ? m[1].trim().replace(/`/g, "") : undefined;
  };
  const obj = {};
  for (const f of HANDOFF_FIELDS) {
    const v = field(f);
    if (v !== undefined) obj[f.toLowerCase()] = v;
  }
  obj.sections = [...text.matchAll(/^## (.+?)\s*$/gm)].map((m) => m[1]).filter((s) => HANDOFF_SECTIONS.includes(s));
  return obj;
}

function listHandoffs() {
  const out = [];
  for (const tool of TOOLS) {
    const dir = `${AI}/tool-output/${tool}`;
    if (!existsSync(abs(dir))) continue;
    for (const f of readdirSync(abs(dir)).filter((x) => x.endsWith(".md") && x !== "README.md").sort()) {
      out.push({ tool, id: basename(f, ".md"), path: `${dir}/${f}` });
    }
  }
  return out.sort((a, b) => compareIds(a.id, b.id));
}

// ---------------------------------------------------------------------------
// Generated status summary (the page M365 Copilot and every tool read first)
// ---------------------------------------------------------------------------
function renderSummary() {
  const cur = readJson(FILES.current);
  const next = readJson(FILES.next);
  const dec = readJson(FILES.decisions);
  const rk = readJson(FILES.risks);
  const reg = readJson(SOURCES.registry);
  const d = cur.derived;
  const la = cur.last_assignment;
  const title = (id) => reg.tasks.find((t) => t.id === id)?.title ?? "";
  const esc = (s) => String(s).replace(/\|/g, "\\|");
  const rel = (p) => p.replace(/^docs\/ai\//, "");
  const task = (t) => `**${esc(t.title)}** — ${t.kind === "founder_action" ? "founder action" : `assignment${t.id ? ` ${t.id}` : ""}`}; owner ${esc(t.owner)}; tool \`${t.tool}\`; gate: ${esc(t.gate)}; deployment ${t.deployment_allowed ? "allowed" : "not allowed"}.`;
  const decided = new Set([...dec.rulings.map((r) => r.id), ...dec.logged.map((l) => l.id)]);
  const L = [];
  L.push("<!-- AUTO-GENERATED by scripts/ai/state.mjs from docs/ai/*.json and the status registry. DO NOT EDIT BY HAND. Run: node scripts/ai/state.mjs generate -->");
  L.push("");
  L.push("# NyayOS — AI status summary");
  L.push("");
  L.push(`Read this page first. State as of **${cur.updated}**. Sources: [CURRENT_STATE](CURRENT_STATE.json) · [NEXT_TASK](NEXT_TASK.json) · [DECISIONS](DECISIONS.json) · [RISKS](RISKS.json) · [status registry](../founder/NYAYOS_STATUS_REGISTRY.json).`);
  L.push("");
  L.push("## Where we are");
  L.push("");
  L.push(cur.summary);
  L.push("");
  L.push("| | |");
  L.push("|---|---|");
  L.push(`| Repository | \`${cur.repository}\` |`);
  L.push(`| Working branch | \`${cur.working_branch}\` |`);
  L.push(`| Pull request | ${cur.pull_request.number ? `#${cur.pull_request.number}` : "none"} — ${cur.pull_request.draft ? "draft" : "ready"}, ${cur.pull_request.merged ? "merged" : "not merged"} |`);
  L.push(`| Deployment | ${cur.deployment.deployed ? "deployed" : "nothing deployed"}; ${cur.deployment.allowed ? "allowed" : "not allowed"} — ${esc(cur.deployment.note)} |`);
  L.push("");
  L.push("## Last completed assignment");
  L.push("");
  L.push("| | |");
  L.push("|---|---|");
  L.push(`| Assignment | **${la.id}** — ${esc(la.title)} |`);
  L.push(`| Status | ${la.status} |`);
  L.push(`| Tool | \`${la.tool}\` |`);
  L.push(`| Baseline → commit | \`${la.baseline}\` → \`${la.commit}\` (pushed) |`);
  L.push(`| Handoff | [${la.handoff}](${rel(la.handoff)}) |`);
  L.push("");
  L.push("## Next");
  L.push("");
  L.push(`Recommended: ${task(next.recommended)}`);
  L.push("");
  L.push(`> ${next.recommended.rationale}`);
  if (next.alternatives.length) {
    L.push("");
    L.push("Alternatives:");
    L.push("");
    for (const a of next.alternatives) L.push(`- ${task(a)}`);
  }
  if (next.blocked_by.length) {
    L.push("");
    L.push("Blocked by:");
    L.push("");
    for (const b of next.blocked_by) L.push(`- ${b.item} (${b.owner})`);
  }
  L.push("");
  L.push("## Open items");
  L.push("");
  L.push("| ID | Kind | Item | Link |");
  L.push("|---|---|---|---|");
  for (const o of cur.open_items) L.push(`| ${o.id} | ${o.kind.replace(/_/g, " ")} | ${esc(o.description)} | ${[o.decision, o.risk].filter(Boolean).join(", ") || "—"} |`);
  L.push("");
  L.push("## Registry");
  L.push("");
  L.push(`${d.task_count} tasks — CANONICAL ${d.by_status.CANONICAL} · REVIEW ${d.by_status.REVIEW} · IN_PROGRESS ${d.by_status.IN_PROGRESS} · OPEN ${d.by_status.OPEN} · SUPERSEDED ${d.by_status.SUPERSEDED}. Newest: ${d.highest_task_id}.`);
  L.push("");
  L.push(`- **In review:** ${d.review_tasks.map((id) => `${id}`).join(", ") || "none"}`);
  L.push(`- **Open:** ${d.open_tasks.map((id) => `${id} (${esc(title(id))})`).join("; ") || "none"}`);
  L.push("");
  L.push("## Decisions awaiting the founder");
  L.push("");
  const pending = dec.candidates.filter((c) => !decided.has(c.id));
  for (const c of pending) L.push(`- **${c.id}** — ${c.question}`);
  if (!pending.length) L.push("- none");
  const unlogged = dec.rulings.filter((r) => !r.in_decision_log);
  if (unlogged.length) {
    L.push("");
    L.push("Ruled in a brief but not yet in the Decision Log:");
    L.push("");
    for (const r of unlogged) L.push(`- **${r.id}** — ${r.ruling} (${r.source})`);
  }
  L.push("");
  L.push("## Risks");
  L.push("");
  L.push(`Top five (Risk Register): ${rk.top_five.join(" · ")}.`);
  L.push("");
  const open = rk.residuals.filter((r) => r.status === "open");
  L.push("| Residual | Severity | Owner | Origin |");
  L.push("|---|---|---|---|");
  for (const r of open) L.push(`| ${r.id} — ${esc(r.residual)} | ${r.severity} | ${r.owner} | ${r.origin} |`);
  L.push("");
  L.push("## Handoffs on record");
  L.push("");
  for (const h of listHandoffs()) L.push(`- [${h.id}](${rel(h.path)}) — \`${h.tool}\``);
  L.push("");
  L.push("## Rules for the next tool");
  L.push("");
  L.push("Finish every assignment with: commit → push → update `CURRENT_STATE.json` → write `tool-output/<tool>/<A-nnn>.md` → update `NEXT_TASK.json` → `node scripts/ai/state.mjs generate` → commit and push the state. Contract: [TOOL_OUTPUT_CONTRACT.md](TOOL_OUTPUT_CONTRACT.md).");
  L.push("");
  return L.join("\n");
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
  writeFileSync(abs(SUMMARY), renderSummary(), "utf8");
  console.log(`generated: ${FILES.current} (derived), ${FILES.decisions} (logged, candidates), ${FILES.risks} (risks, top_five), ${SUMMARY}`);
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

function check({ head } = {}) {
  const findings = [];
  const add = (f) => findings.push(f);

  // 1. files exist
  const required = [...Object.values(FILES), SUMMARY, ...Object.values(SCHEMAS), ...DOCS,
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
    for (const err of validateSchema(docs[k], readJson(SCHEMAS[k]))) add(`${p}: schema: ${err}`);
  }
  if (findings.length) return findings;
  const { current: cur, next, decisions: dec, risks: rk } = docs;

  // 3. generated content is in sync with its sources
  const d = derived();
  if (!same(cur.derived, d.current)) add(`${FILES.current}: "derived" is stale against ${SOURCES.registry} — run: node scripts/ai/state.mjs generate`);
  if (!same(dec.logged, d.logged)) add(`${FILES.decisions}: "logged" is stale against ${SOURCES.decisionLog} — run generate`);
  if (!same(dec.candidates, d.candidates)) add(`${FILES.decisions}: "candidates" is stale against ${SOURCES.candidateDecisions} §9 — run generate`);
  if (!same(rk.risks, d.risks.risks) || !same(rk.top_five, d.risks.top_five)) add(`${FILES.risks}: "risks"/"top_five" stale against ${SOURCES.riskRegister} — run generate`);
  if (readText(SUMMARY) !== renderSummary()) add(`${SUMMARY} is stale or hand-edited — run: node scripts/ai/state.mjs generate`);

  // 4. the newest registered assignment is recorded, with a pushed commit
  const reg = readJson(SOURCES.registry);
  const regIds = new Set(reg.tasks.map((t) => t.id));
  const la = cur.last_assignment;
  const task = reg.tasks.find((t) => t.id === la.id);
  if (la.id !== d.current.highest_task_id) {
    add(`assignment state not recorded: the registry's newest task is ${d.current.highest_task_id} but ${FILES.current} records ${la.id}. ` +
      "After commit and push, update CURRENT_STATE, the tool handoff and NEXT_TASK (docs/ai/TOOL_OUTPUT_CONTRACT.md).");
  }
  if (!task) add(`${FILES.current}: last_assignment ${la.id} is not in the registry`);
  else {
    if (task.status !== la.status) add(`${FILES.current}: last_assignment.status ${la.status} ≠ registry ${task.status}`);
    if (task.title !== la.title) add(`${FILES.current}: last_assignment.title differs from the registry title`);
  }
  const tip = head ?? "HEAD";
  if (!git(["merge-base", "--is-ancestor", la.commit, tip]).ok) {
    add(`${FILES.current}: last_assignment.commit ${la.commit} is not in the history of ${tip} (commit and push before recording state)`);
  } else if (head) {
    // 4b. no unrecorded work: after the recorded commit only the state commit's files may change
    const diff = git(["diff", "--name-only", la.commit, head]);
    if (!diff.ok) add(`cannot diff ${la.commit}..${head}: ${diff.out}`);
    else {
      const unrecorded = diff.out.split("\n").filter(Boolean).filter((p) => !STATE_PATHS.some((re) => re.test(p)));
      if (unrecorded.length) {
        add(`unrecorded work after ${la.id}'s recorded commit ${la.commit.slice(0, 7)}: ${unrecorded.slice(0, 8).join(", ")}${unrecorded.length > 8 ? ", …" : ""}. ` +
          "Record it: set CURRENT_STATE.last_assignment.commit to the pushed work commit, update the handoff and NEXT_TASK.");
      }
    }
  }
  if (!git(["merge-base", "--is-ancestor", la.baseline, la.commit]).ok) add(`${FILES.current}: last_assignment.baseline is not an ancestor of last_assignment.commit`);

  const expected = `${AI}/tool-output/${la.tool}/${la.id}.md`;
  if (la.handoff !== expected) add(`${FILES.current}: last_assignment.handoff must be ${expected}`);
  if (!existsSync(abs(la.handoff))) add(`missing handoff ${la.handoff}`);

  // 5. every handoff matches the standard schema; the last one matches CURRENT_STATE
  const handoffSchema = readJson(SCHEMAS.handoff);
  for (const hf of listHandoffs()) {
    if (!ID_RE.test(hf.id)) { add(`${hf.path}: file name must be an assignment ID (A-nnn.md)`); continue; }
    if (!regIds.has(hf.id)) add(`${hf.path}: ${hf.id} is not in the registry`);
    const h = parseHandoff(hf.path);
    for (const err of validateSchema(h, handoffSchema)) add(`${hf.path}: handoff schema: ${err}`);
    if (h.assignment && h.assignment !== hf.id) add(`${hf.path}: Assignment ${h.assignment} ≠ file name ${hf.id}`);
    if (h.tool && h.tool !== hf.tool) add(`${hf.path}: Tool ${h.tool} ≠ directory ${hf.tool}`);
    if (h.commit && /^[0-9a-f]{40}$/.test(h.commit) && !git(["cat-file", "-e", `${h.commit}^{commit}`]).ok) add(`${hf.path}: Commit ${h.commit} does not exist in this repository`);
    if (hf.path === la.handoff) {
      if (h.commit !== la.commit) add(`${hf.path}: Commit ≠ CURRENT_STATE last_assignment.commit`);
      if (h.baseline !== la.baseline) add(`${hf.path}: Baseline ≠ CURRENT_STATE last_assignment.baseline`);
      if (h.status !== la.status) add(`${hf.path}: Status ≠ CURRENT_STATE last_assignment.status`);
      if (h.branch !== cur.working_branch) add(`${hf.path}: Branch ≠ CURRENT_STATE working_branch`);
      if (h.deployment !== "none" && !cur.deployment.deployed) add(`${hf.path}: reports a deployment but CURRENT_STATE.deployment.deployed is false`);
    }
  }

  // 6. NEXT_TASK follows the last assignment and recommends an unregistered ID
  if (next.after !== la.id) add(`${FILES.next}: "after" is ${next.after}; must be ${la.id} (update NEXT_TASK with every assignment)`);
  if (next.recommended.id && regIds.has(next.recommended.id)) add(`${FILES.next}: recommended.id ${next.recommended.id} is already registered`);

  // 7. cross-file consistency
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
const [cmd, ...rest] = process.argv.slice(2);
const headIdx = rest.indexOf("--head");
const head = headIdx >= 0 ? rest[headIdx + 1] : undefined;
if (headIdx >= 0 && !/^[0-9a-f]{7,40}$/.test(head ?? "")) {
  console.error("--head needs a commit SHA");
  process.exit(2);
}
if (cmd === "generate") generate();
else if (cmd === "check") {
  const f = check({ head });
  if (f.length) {
    console.error(`ai-state: ${f.length} finding(s)`);
    for (const x of f) console.error(`  ✗ ${x}`);
    process.exit(1);
  }
  const cur = readJson(FILES.current);
  console.log(`ai-state: clean — last assignment ${cur.last_assignment.id} recorded (commit ${cur.last_assignment.commit.slice(0, 7)}, handoff ${cur.last_assignment.handoff}); NEXT_TASK follows it; STATUS_SUMMARY and derived fields in sync${head ? `; no unrecorded work up to ${head.slice(0, 7)}` : ""}`);
} else {
  console.error("usage: node scripts/ai/state.mjs generate | check [--head <sha>]");
  process.exit(2);
}
