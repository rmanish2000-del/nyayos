#!/usr/bin/env node
/**
 * NyayOS repository-centric tool handoff system — generator and validator (A-044, corrected by A-044-R).
 *
 * After the founder says only "CC done", "Gemini done", "Lovable done" or "Figma done", M365 Copilot
 * reads the repository and finds: which tool finished, which task, which commit, which files, which
 * validations, which risks remain, which output is awaited next and which assignment follows.
 *
 *   docs/ai/STATUS_SUMMARY.md                          GENERATED — read first
 *   docs/ai/CURRENT_STATE.json                         per-tool latest completion (derived) + active/blocked/awaited
 *   docs/ai/NEXT_TASK.json                             the next tool assignment
 *   docs/ai/DECISIONS.json, docs/ai/RISKS.json         decisions and risks (partly derived)
 *   docs/ai/tool-output/<tool>/<task-id>/HANDOFF.json  machine-readable handoff (schemas/handoff.schema.json)
 *   docs/ai/tool-output/<tool>/<task-id>/SUMMARY.md    human-readable handoff
 *
 * Usage:
 *   node scripts/ai/state.mjs generate            rewrite derived fields and STATUS_SUMMARY.md
 *   node scripts/ai/state.mjs check               validate everything; exit 1 on any finding
 *   node scripts/ai/state.mjs check --head <sha>  also fail on unrecorded work after the latest completion (pull requests)
 *
 * NYAYOS_AI_ROOT overrides the repository root (used by scripts/ai/state.test.mjs fixtures).
 * No dependencies. Node >= 18. Requires git.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.env.NYAYOS_AI_ROOT
  ? resolve(process.env.NYAYOS_AI_ROOT)
  : resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const AI = "docs/ai";
const OUT = `${AI}/tool-output`;
const FILES = { current: `${AI}/CURRENT_STATE.json`, next: `${AI}/NEXT_TASK.json`, decisions: `${AI}/DECISIONS.json`, risks: `${AI}/RISKS.json` };
const SUMMARY = `${AI}/STATUS_SUMMARY.md`;
const SCHEMAS = {
  current: `${AI}/schemas/current-state.schema.json`,
  next: `${AI}/schemas/next-task.schema.json`,
  decisions: `${AI}/schemas/decisions.schema.json`,
  risks: `${AI}/schemas/risks.schema.json`,
  handoff: `${AI}/schemas/handoff.schema.json`,
};
const TOOLS = ["claude-code", "gemini", "lovable", "figma"];
const TOOL_WORDS = { "claude-code": /claude code/i, gemini: /gemini/i, lovable: /lovable/i, figma: /figma/i };
const SOURCES = {
  registry: "docs/founder/NYAYOS_STATUS_REGISTRY.json",
  decisionLog: "docs/founder/NYAYOS_DECISION_LOG_V1.md",
  candidateDecisions: "docs/architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md",
  riskRegister: "docs/founder/NYAYOS_RISK_REGISTER_V1.md",
  status: "NYAYOS_STATUS.json",
};
// First task that must have a handoff once it is REVIEW or CANONICAL (A-042 is the first backfilled one).
const PROTOCOL_FIRST_TASK = 42;
// Paths that may change after the latest recorded completion commit: the state commit itself, and the
// documents the status-update workflow regenerates from the registry.
const STATE_PATHS = [
  /^docs\/ai\/CURRENT_STATE\.json$/,
  /^docs\/ai\/NEXT_TASK\.json$/,
  /^docs\/ai\/(DECISIONS|RISKS)\.json$/,
  /^docs\/ai\/STATUS_SUMMARY\.md$/,
  /^docs\/ai\/tool-output\/(claude-code|gemini|lovable|figma)\/A-\d{3}(-R\d?)?\/(HANDOFF\.json|SUMMARY\.md)$/,
  /^docs\/founder\/NYAYOS_(STATUS_REGISTRY\.md|DEPENDENCY_GRAPH\.md|STATUS_DASHBOARD\.md|CHANGELOG\.md)$/,
];
const ID_RE = /^A-(\d{3})(-R(\d?))?$/;
const SHA_RE = /^[0-9a-f]{40}$/;

const abs = (p) => resolve(ROOT, p);
const readText = (p) => readFileSync(abs(p), "utf8");
const readJson = (p) => JSON.parse(readText(p));
const writeJson = (p, v) => writeFileSync(abs(p), JSON.stringify(v, null, 2) + "\n", "utf8");
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sortedSet = (a) => [...new Set(a)].sort();

function git(args) {
  try {
    return { ok: true, out: execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim() };
  } catch (e) {
    return { ok: false, out: String(e.stderr ?? e.message).trim() };
  }
}
const commitExists = (sha) => SHA_RE.test(sha ?? "") && git(["cat-file", "-e", `${sha}^{commit}`]).ok;
const isAncestor = (a, b) => git(["merge-base", "--is-ancestor", a, b]).ok;

// ---------------------------------------------------------------------------
// Minimal JSON Schema validator (the subset the docs/ai schemas use)
// ---------------------------------------------------------------------------
function validateSchema(value, schema, root = schema, path = "$") {
  const errors = [];
  if (schema.$ref) {
    const target = root.$defs?.[schema.$ref.replace(/^#\/\$defs\//, "")];
    return target ? validateSchema(value, target, root, path) : [`${path}: unresolved $ref ${schema.$ref}`];
  }
  const typeOf = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : Number.isInteger(v) ? "integer" : typeof v);
  if (schema.type) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    const t = typeOf(value);
    if (!types.some((x) => x === t || (x === "number" && t === "integer"))) return [`${path}: expected ${types.join("|")}, got ${t}`];
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
    }
  }
  return errors;
}

// ---------------------------------------------------------------------------
// IDs and derivations
// ---------------------------------------------------------------------------
function idKey(id) {
  const m = ID_RE.exec(id ?? "");
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
  const latestByTool = {};
  for (const tool of TOOLS) {
    const done = tasks.filter((t) => ["REVIEW", "CANONICAL"].includes(t.status) && TOOL_WORDS[tool].test(t.tool ?? "")).map((t) => t.id).sort(compareIds);
    latestByTool[tool] = done.length ? done[done.length - 1] : null;
  }
  return {
    source: SOURCES.registry, registry_updated: reg.updated ?? null, task_count: tasks.length, by_status: byStatus,
    highest_task_id: ids[ids.length - 1], open_tasks: list("OPEN"), in_progress_tasks: list("IN_PROGRESS"), review_tasks: list("REVIEW"),
    registry_latest_by_tool: latestByTool,
  };
}

function deriveLoggedDecisions() {
  const text = readText(SOURCES.decisionLog);
  return [...text.matchAll(/^## (D-\d{3}) — (.+)$/gm)].map((m) => {
    const nextHeading = text.indexOf("\n## ", m.index + 3);
    const body = text.slice(m.index, nextHeading > 0 ? nextHeading : text.length);
    const st = /\*\*Status:\*\*\s*([^.\n]+)/.exec(body);
    return { id: m[1], title: m[2].trim(), log_status: st ? st[1].replace(/\*/g, "").trim() : null };
  });
}
function deriveCandidateDecisions() {
  const text = readText(SOURCES.candidateDecisions);
  const start = text.indexOf("## 9. Decisions required before wave W1");
  if (start < 0) return [];
  const end = text.indexOf("\n## ", start + 5);
  const section = text.slice(start, end > 0 ? end : text.length);
  return [...section.matchAll(/^\| (D-\d{3}) \| (.+) \|$/gm)].map((m) => ({ id: m[1], question: m[2].trim() }));
}
function deriveRisks() {
  const text = readText(SOURCES.riskRegister);
  const risks = [...text.matchAll(/^\| (R\d{2}) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)].map((m) => ({
    id: m[1], risk: m[2].trim(), severity: m[3].trim(), likelihood: m[4].trim(), control: m[5].trim(), trigger: m[6].trim(),
  }));
  const s = text.indexOf("## Top five");
  const e = s >= 0 ? text.indexOf("\n## ", s + 5) : -1;
  const top = s < 0 ? [] : [...text.slice(s, e > 0 ? e : text.length).matchAll(/^### \d+\. (.+)$/gm)].map((m) => m[1].trim());
  return { risks, top_five: top };
}

// ---------------------------------------------------------------------------
// Handoffs
// ---------------------------------------------------------------------------
/** Scans docs/ai/tool-output. Returns handoffs plus structural findings (never throws). */
function scanHandoffs() {
  const handoffs = [];
  const findings = [];
  if (!existsSync(abs(OUT))) return { handoffs, findings: [`missing directory ${OUT}`] };
  for (const entry of readdirSync(abs(OUT)).sort()) {
    const p = `${OUT}/${entry}`;
    if (!statSync(abs(p)).isDirectory()) continue;
    if (!TOOLS.includes(entry)) { findings.push(`unknown tool identifier "${entry}" (${p}); allowed: ${TOOLS.join(", ")}`); continue; }
    for (const sub of readdirSync(abs(p)).sort()) {
      const sp = `${p}/${sub}`;
      if (!statSync(abs(sp)).isDirectory()) {
        if (sub !== "README.md") findings.push(`${sp}: stray file — handoffs live in ${p}/<task-id>/HANDOFF.json and SUMMARY.md`);
        continue;
      }
      if (!ID_RE.test(sub)) { findings.push(`${sp}: directory name must be a task ID (A-nnn or A-nnn-R)`); continue; }
      const hp = `${sp}/HANDOFF.json`;
      if (!existsSync(abs(hp))) { findings.push(`${sp}: completion without HANDOFF.json`); continue; }
      if (!existsSync(abs(`${sp}/SUMMARY.md`))) findings.push(`${sp}: missing SUMMARY.md`);
      let data = null;
      try { data = readJson(hp); } catch (e) { findings.push(`${hp}: invalid JSON (${e.message})`); continue; }
      handoffs.push({ tool: entry, id: sub, path: hp, summary: `${sp}/SUMMARY.md`, data });
    }
  }
  return { handoffs, findings };
}

function completedHandoffs(handoffs) {
  return handoffs
    .filter((h) => h.data?.status === "completed" && typeof h.data.completed_at === "string")
    .sort((a, b) => Date.parse(a.data.completed_at) - Date.parse(b.data.completed_at) || compareIds(a.id, b.id));
}

function deriveToolState(handoffs) {
  const done = completedHandoffs(handoffs);
  const perTool = {};
  for (const tool of TOOLS) {
    const mine = done.filter((h) => h.tool === tool);
    const last = mine[mine.length - 1];
    perTool[tool] = last
      ? { latest_completed_task: last.id, latest_completion_commit: last.data.completion_commit, handoff: last.path }
      : { latest_completed_task: null, latest_completion_commit: null, handoff: null };
  }
  const last = done[done.length - 1];
  const latest = last
    ? { task_id: last.id, tool: last.tool, completion_commit: last.data.completion_commit, completed_at: last.data.completed_at, handoff: last.path }
    : null;
  return { perTool, latest };
}

function validateHandoff(h, schema, reg, tip, add) {
  const d = h.data;
  const where = h.path;
  for (const err of validateSchema(d, schema)) add(`${where}: schema: ${err}`);
  if (d.task_id !== undefined && d.task_id !== h.id) add(`${where}: task_id ${d.task_id} ≠ directory ${h.id}`);
  if (d.tool !== undefined && d.tool !== h.tool) add(`${where}: tool ${d.tool} ≠ directory ${h.tool} (tool ownership)`);
  const task = reg.tasks.find((t) => t.id === h.id);
  if (!task) add(`${where}: ${h.id} is not in the status registry`);
  else if (d.status === "completed" && !["REVIEW", "CANONICAL"].includes(task.status)) add(`${where}: status completed but the registry says ${task.status}`);
  const b = d.baseline_commit, c = d.completion_commit;
  if (!commitExists(b)) add(`${where}: baseline_commit ${b ?? "(missing)"} does not exist in repository history`);
  if (!commitExists(c)) { add(`${where}: completion_commit ${c ?? "(missing)"} does not exist in repository history`); return; }
  if (!isAncestor(c, tip)) add(`${where}: completion_commit ${c} is not in the history of ${tip}`);
  if (commitExists(b) && !isAncestor(b, c)) add(`${where}: baseline_commit is not an ancestor of completion_commit`);
  if (!d.backfill) {
    const subject = git(["log", "-1", "--format=%s", c]).out;
    const tag = `[TOOL:${String(d.tool).toUpperCase()}][TASK:${h.id}]`;
    if (!subject.startsWith(tag)) add(`${where}: completion_commit subject must start with ${tag} (got "${subject.slice(0, 60)}")`);
  }
  const committed = Date.parse(git(["log", "-1", "--format=%cI", c]).out);
  if (typeof d.completed_at === "string" && Date.parse(d.completed_at) < committed) add(`${where}: completed_at is earlier than the completion commit`);
  if (commitExists(b)) {
    const diff = git(["diff", "--no-renames", "--name-status", b, c]);
    const actual = { A: [], M: [], D: [] };
    for (const line of diff.out.split("\n").filter(Boolean)) {
      const [st, ...rest] = line.split("\t");
      (actual[st[0]] ?? (actual[st[0]] = [])).push(rest.join("\t"));
    }
    const cmp = (label, listed, real) => {
      const L = sortedSet(listed ?? []), R = sortedSet(real);
      const missing = R.filter((x) => !L.includes(x)), extra = L.filter((x) => !R.includes(x));
      if (extra.length) add(`${where}: ${label} lists paths not ${label.replace("files_", "")} in ${b.slice(0, 7)}..${c.slice(0, 7)}: ${extra.slice(0, 5).join(", ")}`);
      if (missing.length) add(`${where}: ${label} omits paths ${label.replace("files_", "")} in ${b.slice(0, 7)}..${c.slice(0, 7)}: ${missing.slice(0, 5).join(", ")}`);
    };
    cmp("files_created", d.files_created, actual.A);
    cmp("files_modified", d.files_modified, actual.M);
    cmp("files_deleted", d.files_deleted, actual.D);
  }
  for (const ev of d.evidence ?? []) {
    const r = ev.ref ?? "";
    if (/^https:\/\//.test(r)) continue;
    if (SHA_RE.test(r)) { if (!commitExists(r)) add(`${where}: evidence commit ${r} does not exist`); continue; }
    if (!existsSync(abs(r))) add(`${where}: evidence path ${r} does not exist`);
  }
  const dep = d.deployment ?? {};
  if (dep.environment === "none" && (dep.status !== "not_deployed" || dep.url !== null)) add(`${where}: deployment environment none must be not_deployed with url null`);
  if (dep.status === "deployed" && (!dep.allowed || !dep.url)) add(`${where}: a deployment needs allowed=true and a url`);
  if (existsSync(abs(h.summary)) && !readText(h.summary).includes(h.id)) add(`${h.summary}: must name the task ${h.id}`);
}

// ---------------------------------------------------------------------------
// Status summary
// ---------------------------------------------------------------------------
function renderSummary(handoffs) {
  const cur = readJson(FILES.current);
  const next = readJson(FILES.next);
  const dec = readJson(FILES.decisions);
  const rk = readJson(FILES.risks);
  const esc = (s) => String(s ?? "—").replace(/\|/g, "\\|");
  const rel = (p) => (p ? p.replace(/^docs\/ai\//, "") : null);
  const link = (p) => (p ? `[${p}](${rel(p)})` : "—");
  const L = [];
  const add = (...x) => L.push(...x);
  add("<!-- AUTO-GENERATED by scripts/ai/state.mjs from docs/ai/*.json, the handoffs and the status registry. DO NOT EDIT BY HAND. Run: node scripts/ai/state.mjs generate -->", "");
  add("# NyayOS — AI status summary", "");
  add(`Read this page first. Updated **${cur.last_updated}**. When the founder says **"CC done"**, **"Gemini done"**, **"Lovable done"** or **"Figma done"**, read that tool's row below, then its HANDOFF.json.`, "");
  add("## By tool", "");
  add("| Tool | Status | Latest completed task | Completion commit | Handoff | Note |", "|---|---|---|---|---|---|");
  for (const t of TOOLS) {
    const s = cur.tools[t];
    add(`| \`${t}\` | ${s.status} | ${s.latest_completed_task ?? "—"} | ${s.latest_completion_commit ? `\`${s.latest_completion_commit}\`` : "—"} | ${link(s.handoff)} | ${esc(s.reason ?? "")} |`);
  }
  add("");
  const lc = cur.latest_completion;
  add("## Latest completion", "");
  if (!lc) add("None recorded.", "");
  else {
    const h = handoffs.find((x) => x.path === lc.handoff)?.data;
    add(`**${lc.task_id}** by \`${lc.tool}\` — commit \`${lc.completion_commit}\`, completed ${lc.completed_at}. Handoff: ${link(lc.handoff)} · summary: ${link(lc.handoff.replace(/HANDOFF\.json$/, "SUMMARY.md"))}.`, "");
    if (h) {
      const files = [...h.files_created.map((f) => `+ ${f}`), ...h.files_modified.map((f) => `~ ${f}`), ...(h.files_deleted ?? []).map((f) => `- ${f}`)];
      add(`Files: ${h.files_created.length} created, ${h.files_modified.length} modified, ${(h.files_deleted ?? []).length} deleted.`, "");
      add("```text", ...files.slice(0, 40), ...(files.length > 40 ? [`… ${files.length - 40} more in the handoff`] : []), "```", "");
      add("| Validation | Result |", "|---|---|");
      for (const t of h.tests) add(`| ${esc(t.name)} | ${t.result}${t.detail ? ` — ${esc(t.detail)}` : ""} |`);
      add("");
      if (h.risks.length) {
        add("Risks left by this task:", "");
        for (const r of h.risks) add(`- ${r.severity}: ${r.description}${r.ref ? ` (${r.ref})` : ""}`);
        add("");
      }
      add(`Rollback: ${h.rollback}`, "");
    }
  }
  add("## Awaited outputs (in order)", "");
  if (!cur.awaited_outputs.length) add("None.", "");
  else {
    add("| # | Task | Owner | Output | Ready | Waiting on |", "|---|---|---|---|---|---|");
    for (const a of [...cur.awaited_outputs].sort((x, y) => x.order - y.order)) add(`| ${a.order} | ${a.task_id ?? "(not issued)"} | \`${a.owner}\` | ${esc(a.output)} | ${a.ready ? "yes" : "no"} | ${esc(a.waiting_on ?? "")} |`);
    add("");
  }
  add("## Next assignment", "");
  add(`**${next.task_id ?? "(ID to be issued by the founder)"} — ${esc(next.title)}** · tool \`${next.assigned_tool}\` · ${next.priority} · ${next.ready ? "ready" : "not ready"} · baseline \`${next.repository_baseline.branch}@${next.repository_baseline.commit.slice(0, 7)}\` · environment: ${esc(next.environment)} · deployment ${next.deployment_permission.allowed ? `allowed (${next.deployment_permission.environment})` : "not allowed"}.`, "");
  add(`> ${next.rationale}`, "");
  if (next.dependencies.length) {
    for (const dep of next.dependencies) add(`- [${dep.satisfied ? "x" : " "}] ${dep.item} (${dep.owner})`);
    add("");
  }
  add(`Next integration task: ${next ? esc(cur.next_integration_task.description) : ""} (${cur.next_integration_task.owner}).`, "");
  add("## Where we are", "", `Phase: ${cur.current_phase}`, "", cur.summary, "");
  add("| | |", "|---|---|");
  add(`| Branches | canonical \`${cur.canonical_branch}\`; working \`${cur.working_branch}\` |`);
  add(`| Pull request | ${cur.current_pr.number ? `[#${cur.current_pr.number}](${cur.current_pr.url})` : "none"} — ${cur.current_pr.draft ? "draft" : "ready"}, ${cur.current_pr.merged ? "merged" : "not merged"} |`);
  add(`| Deployment | ${cur.deployment.status}; environment ${cur.deployment.environment}; ${cur.deployment.allowed ? "allowed" : "not allowed"} — ${esc(cur.deployment.note)} |`, "");
  add("## Active and blocked", "");
  add(`Active: ${cur.active_tasks.map((a) => `${a.task_id} (\`${a.tool}\`, ${a.status})`).join("; ") || "none"}.`, "");
  add("Blocked:", "");
  for (const b of cur.blocked_tasks) add(`- ${b.task_id} (\`${b.owner}\`): ${b.reason}`);
  if (!cur.blocked_tasks.length) add("- none");
  add("");
  add("## Open items", "", "| ID | Kind | Item | Link |", "|---|---|---|---|");
  for (const o of cur.open_items) add(`| ${o.id} | ${o.kind.replace(/_/g, " ")} | ${esc(o.description)} | ${[o.decision, o.risk].filter(Boolean).join(", ") || "—"} |`);
  add("");
  const decided = new Set([...dec.rulings.map((r) => r.id), ...dec.logged.map((l) => l.id)]);
  add("## Decisions awaiting the founder", "");
  const pending = dec.candidates.filter((c) => !decided.has(c.id));
  for (const c of pending) add(`- **${c.id}** — ${c.question}`);
  if (!pending.length) add("- none");
  for (const r of dec.rulings.filter((x) => !x.in_decision_log)) add(`- **${r.id}** ruled in a brief, not yet logged: ${r.ruling}`);
  add("");
  add("## Residual risks", "", `Top five (Risk Register): ${rk.top_five.join(" · ") || "—"}.`, "", "| Residual | Severity | Owner | Origin |", "|---|---|---|---|");
  for (const r of rk.residuals.filter((x) => x.status === "open")) add(`| ${r.id} — ${esc(r.residual)} | ${r.severity} | ${r.owner} | ${r.origin} |`);
  add("");
  add("## All handoffs", "");
  for (const h of [...handoffs].sort((a, b) => compareIds(a.id, b.id))) add(`- ${h.id} — \`${h.tool}\` — ${h.data?.status ?? "?"} — ${link(h.path)}`);
  if (!handoffs.length) add("- none");
  add("");
  return L.join("\n");
}

// ---------------------------------------------------------------------------
// generate
// ---------------------------------------------------------------------------
function generate() {
  const { handoffs } = scanHandoffs();
  const cur = readJson(FILES.current);
  cur.derived = deriveRegistry();
  const { perTool, latest } = deriveToolState(handoffs);
  const activeTools = new Set(cur.active_tasks.map((a) => a.tool));
  for (const t of TOOLS) {
    const s = { ...(cur.tools?.[t] ?? { status: "no_records", reason: "no repository handoff yet" }), ...perTool[t] };
    if (activeTools.has(t)) { s.status = "active"; s.reason = null; }
    else if (s.status === "active") { s.status = s.latest_completed_task ? "idle" : "no_records"; s.reason = s.latest_completed_task ? null : "no repository handoff yet"; }
    cur.tools = { ...(cur.tools ?? {}), [t]: { status: s.status, latest_completed_task: s.latest_completed_task, latest_completion_commit: s.latest_completion_commit, handoff: s.handoff, reason: s.reason ?? null } };
  }
  cur.latest_completion = latest;
  writeJson(FILES.current, cur);
  const dec = readJson(FILES.decisions);
  dec.logged = deriveLoggedDecisions();
  dec.candidates = deriveCandidateDecisions();
  writeJson(FILES.decisions, dec);
  const rk = readJson(FILES.risks);
  const r = deriveRisks();
  rk.risks = r.risks;
  rk.top_five = r.top_five;
  writeJson(FILES.risks, rk);
  writeFileSync(abs(SUMMARY), renderSummary(handoffs), "utf8");
  console.log(`generated: ${FILES.current}, ${FILES.decisions}, ${FILES.risks}, ${SUMMARY}`);
}

// ---------------------------------------------------------------------------
// check
// ---------------------------------------------------------------------------
function check({ head } = {}) {
  const findings = [];
  const add = (f) => findings.push(f);
  const tip = head ?? "HEAD";

  // 1. required files
  const required = [...Object.values(FILES), SUMMARY, ...Object.values(SCHEMAS), `${AI}/README.md`,
    ...TOOLS.map((t) => `${OUT}/${t}/README.md`), ...Object.values(SOURCES)];
  for (const p of required) if (!existsSync(abs(p))) add(`missing file ${p}`);
  if (findings.length) return findings;

  // 2. state files parse and match their schemas
  const docs = {};
  for (const [k, p] of Object.entries(FILES)) {
    try { docs[k] = readJson(p); } catch (e) { add(`${p}: invalid JSON (${e.message})`); continue; }
    for (const err of validateSchema(docs[k], readJson(SCHEMAS[k]))) add(`${p}: schema: ${err}`);
  }
  if (findings.length) return findings;
  const { current: cur, next, decisions: dec, risks: rk } = docs;
  const reg = readJson(SOURCES.registry);

  // 3. handoffs: structure, schema, ownership, commits, files, evidence
  const { handoffs, findings: structural } = scanHandoffs();
  structural.forEach(add);
  const schema = readJson(SCHEMAS.handoff);
  const owners = new Map();
  for (const h of handoffs) {
    if (owners.has(h.id)) add(`duplicate task ownership: ${h.id} is claimed by ${owners.get(h.id)} and ${h.tool}`);
    else owners.set(h.id, h.tool);
    validateHandoff(h, schema, reg, tip, add);
  }
  const completed = new Set(completedHandoffs(handoffs).map((h) => h.id));

  // 4. a completion needs a handoff: every REVIEW/CANONICAL task from the protocol start onward
  for (const t of reg.tasks) {
    if (["REVIEW", "CANONICAL"].includes(t.status) && idKey(t.id)[0] >= PROTOCOL_FIRST_TASK && !completed.has(t.id)) {
      add(`completion without HANDOFF.json: registry marks ${t.id} ${t.status} but no docs/ai/tool-output/<tool>/${t.id}/HANDOFF.json with status completed exists`);
    }
  }

  // 5. derived content is current (stale CURRENT_STATE fails)
  if (!same(cur.derived, deriveRegistry())) add(`${FILES.current}: "derived" is stale against ${SOURCES.registry} — run: node scripts/ai/state.mjs generate`);
  const { perTool, latest } = deriveToolState(handoffs);
  for (const t of TOOLS) {
    const s = cur.tools[t];
    for (const k of ["latest_completed_task", "latest_completion_commit", "handoff"]) {
      if (s[k] !== perTool[t][k]) add(`${FILES.current}: tools.${t}.${k} is stale (${s[k]} ≠ ${perTool[t][k]}) — run generate`);
    }
  }
  if (!same(cur.latest_completion, latest)) add(`${FILES.current}: latest_completion is stale against the handoffs — run generate`);
  if (latest && Date.parse(cur.last_updated) < Date.parse(latest.completed_at)) add(`${FILES.current}: last_updated is older than the latest completion`);
  if (!same(dec.logged, deriveLoggedDecisions())) add(`${FILES.decisions}: "logged" is stale against ${SOURCES.decisionLog} — run generate`);
  if (!same(dec.candidates, deriveCandidateDecisions())) add(`${FILES.decisions}: "candidates" is stale — run generate`);
  const r = deriveRisks();
  if (!same(rk.risks, r.risks) || !same(rk.top_five, r.top_five)) add(`${FILES.risks}: "risks"/"top_five" stale against ${SOURCES.riskRegister} — run generate`);
  if (readText(SUMMARY) !== renderSummary(handoffs)) add(`${SUMMARY} is stale or hand-edited — run: node scripts/ai/state.mjs generate`);

  // 6. state is not contradictory
  const activeTools = new Set(cur.active_tasks.map((a) => a.tool));
  for (const t of TOOLS) {
    const s = cur.tools[t];
    if ((s.status === "active") !== activeTools.has(t)) add(`contradictory state: tools.${t}.status is ${s.status} but active_tasks ${activeTools.has(t) ? "lists" : "does not list"} ${t}`);
    if (["blocked", "no_records"].includes(s.status) && !s.reason) add(`${FILES.current}: tools.${t} is ${s.status} without a reason`);
    if (s.status === "no_records" && s.latest_completed_task) add(`contradictory state: tools.${t} is no_records but has a completed task`);
  }
  const regStatus = new Map(reg.tasks.map((t) => [t.id, t.status]));
  const seen = new Map();
  for (const [label, list] of [["active_tasks", cur.active_tasks], ["blocked_tasks", cur.blocked_tasks]]) {
    for (const a of list) {
      if (completed.has(a.task_id)) add(`contradictory state: ${a.task_id} is in ${label} but has a completed handoff`);
      if (seen.has(a.task_id)) add(`contradictory state: ${a.task_id} is in both ${seen.get(a.task_id)} and ${label}`);
      seen.set(a.task_id, label);
      const st = regStatus.get(a.task_id);
      if (st && !["OPEN", "IN_PROGRESS"].includes(st)) add(`contradictory state: ${a.task_id} is in ${label} but the registry says ${st}`);
    }
  }
  const orders = cur.awaited_outputs.map((a) => a.order).sort((x, y) => x - y);
  if (!orders.every((o, i) => o === i + 1)) add(`${FILES.current}: awaited_outputs.order must run 1..${orders.length} without gaps`);
  for (const a of cur.awaited_outputs) if (a.task_id && completed.has(a.task_id)) add(`contradictory state: awaited output ${a.task_id} already has a completed handoff`);
  if (cur.next_integration_task.task_id && completed.has(cur.next_integration_task.task_id)) add(`contradictory state: next_integration_task ${cur.next_integration_task.task_id} is already completed`);

  // 7. NEXT_TASK follows the latest completion and is consistent
  if (latest && next.after !== latest.task_id) add(`${FILES.next}: "after" is ${next.after}; must be the latest completion ${latest.task_id}`);
  if (next.task_id && (completed.has(next.task_id) || ["REVIEW", "CANONICAL"].includes(regStatus.get(next.task_id)))) add(`contradictory state: NEXT_TASK ${next.task_id} is already completed`);
  if (next.ready && next.dependencies.some((d) => !d.satisfied)) add(`contradictory state: NEXT_TASK is ready but has unsatisfied dependencies`);
  if (!commitExists(next.repository_baseline.commit) || !isAncestor(next.repository_baseline.commit, tip)) add(`${FILES.next}: repository_baseline.commit is not in the history of ${tip}`);

  // 8. no unrecorded work after the latest completion (pull requests)
  if (head && latest && commitExists(latest.completion_commit) && isAncestor(latest.completion_commit, head)) {
    const diff = git(["diff", "--name-only", latest.completion_commit, head]);
    const unrecorded = diff.out.split("\n").filter(Boolean).filter((p) => !STATE_PATHS.some((re) => re.test(p)));
    if (unrecorded.length) {
      add(`unrecorded work after ${latest.task_id}'s completion commit ${latest.completion_commit.slice(0, 7)}: ${unrecorded.slice(0, 8).join(", ")}${unrecorded.length > 8 ? ", …" : ""}. ` +
        "Write docs/ai/tool-output/<tool>/<task-id>/HANDOFF.json for the pushed work and run generate.");
    }
  }

  // 9. cross-references
  const status = readJson(SOURCES.status);
  if (!(status.feature_branches ?? []).some((b) => b.name === cur.working_branch) && cur.working_branch !== cur.canonical_branch) {
    add(`${FILES.current}: working_branch ${cur.working_branch} is not listed in ${SOURCES.status}`);
  }
  const decIds = new Set([...dec.logged.map((x) => x.id), ...dec.candidates.map((x) => x.id)]);
  for (const x of dec.rulings) if (!decIds.has(x.id)) add(`${FILES.decisions}: ruling ${x.id} is neither logged nor a candidate`);
  const riskIds = new Set(rk.residuals.map((x) => x.id));
  for (const o of cur.open_items) {
    if (o.risk && !riskIds.has(o.risk)) add(`${FILES.current}: open item ${o.id} cites unknown residual ${o.risk}`);
    if (o.decision && !decIds.has(o.decision)) add(`${FILES.current}: open item ${o.id} cites unknown decision ${o.decision}`);
  }
  return findings;
}

// ---------------------------------------------------------------------------
const [cmd, ...rest] = process.argv.slice(2);
const hi = rest.indexOf("--head");
const head = hi >= 0 ? rest[hi + 1] : undefined;
if (hi >= 0 && !/^[0-9a-f]{7,40}$/.test(head ?? "")) { console.error("--head needs a commit SHA"); process.exit(2); }
if (cmd === "generate") generate();
else if (cmd === "check") {
  const f = check({ head });
  if (f.length) {
    console.error(`ai-state: ${f.length} finding(s)`);
    for (const x of f) console.error(`  ✗ ${x}`);
    process.exit(1);
  }
  const cur = readJson(FILES.current);
  const lc = cur.latest_completion;
  console.log(`ai-state: clean — latest completion ${lc ? `${lc.task_id} by ${lc.tool} at ${lc.completion_commit.slice(0, 7)}` : "none"}; ` +
    `${TOOLS.map((t) => `${t}=${cur.tools[t].latest_completed_task ?? cur.tools[t].status}`).join(", ")}${head ? `; no unrecorded work up to ${head.slice(0, 7)}` : ""}`);
} else {
  console.error("usage: node scripts/ai/state.mjs generate | check [--head <sha>]");
  process.exit(2);
}
