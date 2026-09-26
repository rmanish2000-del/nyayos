// Tests for scripts/ai/state.mjs (A-044-R). Each test builds a throwaway git repository with synthetic
// governance sources, real schemas, and one completed handoff from each tool, then mutates it.
// Run: node --test scripts/ai/state.test.mjs   (no dependencies; needs git)
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, "..", "..");
const SCRIPT = join(HERE, "state.mjs");
const TOOLS = ["claude-code", "gemini", "lovable", "figma"];
const TASK = { "claude-code": "A-050", gemini: "A-051", lovable: "A-052", figma: "A-053" };
const WORDS = { "claude-code": "Claude Code", gemini: "Gemini", lovable: "Lovable", figma: "Figma" };
const made = [];
after(() => { for (const d of made) rmSync(d, { recursive: true, force: true }); });

const git = (dir, ...args) =>
  execFileSync("git", ["-c", "user.name=fixture", "-c", "user.email=fixture@example.invalid", "-c", "commit.gpgsign=false", ...args], { cwd: dir, encoding: "utf8" }).trim();
const put = (dir, p, v) => {
  mkdirSync(dirname(join(dir, p)), { recursive: true });
  writeFileSync(join(dir, p), typeof v === "string" ? v : JSON.stringify(v, null, 2) + "\n");
};
const get = (dir, p) => JSON.parse(readFileSync(join(dir, p), "utf8"));
const edit = (dir, p, fn) => { const v = get(dir, p); fn(v); put(dir, p, v); };
const run = (dir, ...args) => {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { env: { ...process.env, NYAYOS_AI_ROOT: dir }, encoding: "utf8" });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};
const handoffPath = (tool) => `docs/ai/tool-output/${tool}/${TASK[tool]}/HANDOFF.json`;

function fixture({ untagged = null } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "nyayos-ai-"));
  made.push(dir);
  git(dir, "init", "-q");
  git(dir, "checkout", "-q", "-b", "work");
  put(dir, "docs/founder/NYAYOS_STATUS_REGISTRY.json", {
    updated: "2026-09-26",
    tasks: [
      ...TOOLS.map((t) => ({ id: TASK[t], title: `Fixture task for ${t}`, status: "REVIEW", tool: `${WORDS[t]} — fixture` })),
      { id: "A-054", title: "Fixture next task", status: "OPEN", tool: "Claude Code — fixture" },
    ],
  });
  put(dir, "docs/founder/NYAYOS_DECISION_LOG_V1.md", "# Log\n\n## D-001 — Fixture decision\n\n**Status:** Locked.\n");
  put(dir, "docs/architecture/NYAYOS_FMA_MERGE_READINESS_REVIEW_A032.md",
    "## 9. Decisions required before wave W1\n\n| Candidate | Decision |\n|---|---|\n| D-031 | Fixture question |\n\n## 10. End\n");
  put(dir, "docs/founder/NYAYOS_RISK_REGISTER_V1.md",
    "| ID | Risk | Severity | Likelihood | Control | Trigger |\n|---|---|---|---|---|---|\n| R01 | Fixture risk | High | Low | control | trigger |\n\n## Top five\n\n### 1. Fixture\n\n## Risk acceptance\n");
  put(dir, "NYAYOS_STATUS.json", { feature_branches: [{ name: "work" }] });
  for (const f of readdirSync(join(REPO, "docs/ai/schemas"))) cpSync(join(REPO, "docs/ai/schemas", f), join(dir, "docs/ai/schemas", f));
  put(dir, "docs/ai/README.md", "# fixture\n");
  for (const t of TOOLS) put(dir, `docs/ai/tool-output/${t}/README.md`, `# ${t}\n`);
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "init");
  const commits = {};
  let prev = git(dir, "rev-parse", "HEAD");
  const t0 = Date.now();
  TOOLS.forEach((t, i) => {
    put(dir, `work/${t}.txt`, `${t} output\n`);
    git(dir, "add", `work/${t}.txt`); // explicit paths only: the protocol forbids sweeping in other tasks' files
    const msg = untagged === t ? `feat: fixture ${t} without tag` : `[TOOL:${t.toUpperCase()}][TASK:${TASK[t]}] feat: fixture ${t}`;
    git(dir, "commit", "-q", "-m", msg);
    const c = git(dir, "rev-parse", "HEAD");
    commits[t] = { baseline: prev, completion: c };
    put(dir, handoffPath(t), {
      schema_version: "1.0", project: "NyayOS", task_id: TASK[t], tool: t, status: "completed", branch: "work",
      baseline_commit: prev, completion_commit: c, completed_at: new Date(t0 + (i + 5) * 1000).toISOString(),
      files_created: [`work/${t}.txt`], files_modified: [], tests: [{ name: "fixture test", command: "true", result: "pass" }],
      evidence: [{ description: "fixture output", ref: `work/${t}.txt` }], limitations: [], risks: [],
      rollback: `git revert ${c}`, deployment: { allowed: false, environment: "none", status: "not_deployed", url: null },
      next_recommendation: { task_id: "A-054", tool: "claude-code", reason: "fixture next step" },
    });
    put(dir, `docs/ai/tool-output/${t}/${TASK[t]}/SUMMARY.md`, `# ${TASK[t]} fixture summary\n`);
    prev = c;
  });
  const idle = { status: "idle", latest_completed_task: null, latest_completion_commit: null, handoff: null, reason: null };
  put(dir, "docs/ai/CURRENT_STATE.json", {
    $schema: "./schemas/current-state.schema.json", schema_version: "2.0", project: "NyayOS",
    last_updated: new Date(t0 + 60_000).toISOString(), current_phase: "Fixture phase for validator tests",
    canonical_branch: "main", working_branch: "work", current_pr: { number: null, url: null, draft: true, merged: false },
    deployment: { allowed: false, environment: "none", status: "not_deployed", url: null, note: "fixture" },
    tools: Object.fromEntries(TOOLS.map((t) => [t, { ...idle }])), latest_completion: null,
    active_tasks: [{ task_id: "A-054", tool: "claude-code", status: "issued" }], blocked_tasks: [],
    awaited_outputs: [{ order: 1, task_id: "A-054", owner: "claude-code", output: "fixture output", ready: true }],
    next_integration_task: { task_id: null, owner: "founder", description: "integrate the fixture outputs" },
    summary: "Fixture repository for scripts/ai/state.test.mjs", open_items: [], derived: {},
  });
  put(dir, "docs/ai/NEXT_TASK.json", {
    $schema: "./schemas/next-task.schema.json", schema_version: "2.0", updated: new Date(t0 + 60_000).toISOString(),
    after: "A-053", task_id: "A-054", title: "Fixture next task", assigned_tool: "claude-code", priority: "P1",
    dependencies: [], ready: true, repository_baseline: { branch: "work", commit: prev },
    required_inputs: ["work/claude-code.txt"], expected_outputs: ["docs/ai/tool-output/claude-code/A-054/HANDOFF.json"],
    environment: "fixture", deployment_permission: { allowed: false, environment: "none" }, rationale: "fixture rationale text",
  });
  put(dir, "docs/ai/DECISIONS.json", { $schema: "./schemas/decisions.schema.json", schema_version: "1.0", sources: ["fixture"], logged: [], candidates: [], rulings: [] });
  put(dir, "docs/ai/RISKS.json", { $schema: "./schemas/risks.schema.json", schema_version: "1.0", source: "docs/founder/NYAYOS_RISK_REGISTER_V1.md", risks: [], top_five: [], residuals: [] });
  const gen = run(dir, "generate");
  assert.equal(gen.code, 0, gen.out);
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "[TOOL:CLAUDE-CODE][TASK:A-053] chore(ai-state): record fixture handoffs");
  return { dir, commits };
}

const fails = (dir, re, ...args) => {
  const r = run(dir, "check", ...args);
  assert.equal(r.code, 1, `expected failure matching ${re}\n${r.out}`);
  assert.match(r.out, re);
};

// ---------------------------------------------------------------- valid handoffs
const valid = fixture();
for (const t of TOOLS) {
  test(`valid ${t} handoff passes and is the tool's latest completion`, () => {
    const r = run(valid.dir, "check");
    assert.equal(r.code, 0, r.out);
    const cur = get(valid.dir, "docs/ai/CURRENT_STATE.json");
    assert.equal(cur.tools[t].latest_completed_task, TASK[t]);
    assert.equal(cur.tools[t].latest_completion_commit, valid.commits[t].completion);
    assert.equal(cur.tools[t].handoff, handoffPath(t));
  });
}

test("the latest completion and the next awaited output are identified", () => {
  const cur = get(valid.dir, "docs/ai/CURRENT_STATE.json");
  assert.equal(cur.latest_completion.task_id, "A-053");
  assert.equal(cur.latest_completion.tool, "figma");
  assert.equal(cur.tools["claude-code"].status, "active");
  const summary = readFileSync(join(valid.dir, "docs/ai/STATUS_SUMMARY.md"), "utf8");
  assert.match(summary, /\| 1 \| A-054 \| `claude-code` \| fixture output \| yes \|/);
});

test("required workflow passes with valid fixtures (check --head, as task-gate runs it)", () => {
  const head = git(valid.dir, "rev-parse", "HEAD");
  const r = run(valid.dir, "check", "--head", head);
  assert.equal(r.code, 0, r.out);
});

// ---------------------------------------------------------------- failures
test("unknown tool directory fails", () => {
  const { dir } = fixture();
  cpSync(join(dir, "docs/ai/tool-output/gemini/A-051"), join(dir, "docs/ai/tool-output/copilot/A-059"), { recursive: true });
  fails(dir, /unknown tool identifier "copilot"/);
});

test("unknown tool value inside a handoff fails", () => {
  const { dir } = fixture();
  edit(dir, handoffPath("gemini"), (h) => { h.tool = "copilot"; });
  fails(dir, /\$\.tool: "copilot" not in/);
});

test("missing task ID fails", () => {
  const { dir } = fixture();
  edit(dir, handoffPath("lovable"), (h) => { delete h.task_id; });
  fails(dir, /missing required "task_id"/);
});

test("missing completion commit fails", () => {
  const { dir } = fixture();
  edit(dir, handoffPath("figma"), (h) => { delete h.completion_commit; });
  fails(dir, /missing required "completion_commit"/);
});

test("completion commit not in repository history fails", () => {
  const { dir } = fixture();
  edit(dir, handoffPath("gemini"), (h) => { h.completion_commit = "0123456789abcdef0123456789abcdef01234567"; });
  fails(dir, /completion_commit 0123456789abcdef0123456789abcdef01234567 does not exist in repository history/);
});

test("completion commit without the [TOOL:x][TASK:y] tag fails", () => {
  const { dir } = fixture({ untagged: "lovable" });
  fails(dir, /completion_commit subject must start with \[TOOL:LOVABLE\]\[TASK:A-052\]/);
});

test("listed output path that the commit did not create fails", () => {
  const { dir } = fixture();
  edit(dir, handoffPath("claude-code"), (h) => { h.files_created.push("work/ghost.txt"); });
  fails(dir, /files_created lists paths not created .*work\/ghost\.txt/);
});

test("output the commit created but the handoff omits fails", () => {
  const { dir } = fixture();
  edit(dir, handoffPath("claude-code"), (h) => { h.files_created = []; });
  fails(dir, /files_created omits paths created .*work\/claude-code\.txt/);
});

test("task directory without HANDOFF.json fails", () => {
  const { dir } = fixture();
  rmSync(join(dir, handoffPath("figma")));
  fails(dir, /A-053: completion without HANDOFF\.json/);
});

test("registry completion without a handoff fails", () => {
  const { dir } = fixture();
  edit(dir, "docs/founder/NYAYOS_STATUS_REGISTRY.json", (r) => { r.tasks.push({ id: "A-055", title: "done elsewhere", status: "REVIEW", tool: "Gemini" }); });
  fails(dir, /completion without HANDOFF\.json: registry marks A-055 REVIEW/);
});

test("duplicate task ownership fails", () => {
  const { dir } = fixture();
  cpSync(join(dir, "docs/ai/tool-output/gemini/A-051"), join(dir, "docs/ai/tool-output/lovable/A-051"), { recursive: true });
  edit(dir, "docs/ai/tool-output/lovable/A-051/HANDOFF.json", (h) => { h.tool = "lovable"; });
  fails(dir, /duplicate task ownership: A-051 is claimed by gemini and lovable/);
});

test("contradictory state fails: a completed task listed as active", () => {
  const { dir } = fixture();
  edit(dir, "docs/ai/CURRENT_STATE.json", (c) => { c.active_tasks.push({ task_id: "A-051", tool: "gemini", status: "in_progress" }); });
  run(dir, "generate");
  fails(dir, /contradictory state: A-051 is in active_tasks but has a completed handoff/);
});

test("contradictory state fails: NEXT_TASK ready with unsatisfied dependencies", () => {
  const { dir } = fixture();
  edit(dir, "docs/ai/NEXT_TASK.json", (n) => { n.dependencies.push({ item: "founder approval", owner: "founder", satisfied: false }); });
  run(dir, "generate");
  fails(dir, /NEXT_TASK is ready but has unsatisfied dependencies/);
});

test("stale CURRENT_STATE fails", () => {
  const { dir } = fixture();
  edit(dir, "docs/ai/CURRENT_STATE.json", (c) => { c.tools.gemini.latest_completed_task = null; });
  fails(dir, /tools\.gemini\.latest_completed_task is stale/);
});

test("new handoff without regenerating the state fails as stale", () => {
  const { dir } = fixture();
  edit(dir, handoffPath("gemini"), (h) => { h.completed_at = new Date(Date.now() + 120_000).toISOString(); });
  fails(dir, /latest_completion is stale|tools\.\w+\.\w+ is stale|STATUS_SUMMARY\.md is stale/);
});

test("hand-edited status summary fails", () => {
  const { dir } = fixture();
  writeFileSync(join(dir, "docs/ai/STATUS_SUMMARY.md"), "edited by hand\n");
  fails(dir, /STATUS_SUMMARY\.md is stale or hand-edited/);
});

test("unrecorded work after the latest completion fails on pull requests", () => {
  const { dir } = fixture();
  put(dir, "work/unrecorded.txt", "later work\n");
  git(dir, "add", "-A");
  git(dir, "commit", "-q", "-m", "[TOOL:CLAUDE-CODE][TASK:A-054] feat: work without a handoff");
  fails(dir, /unrecorded work after A-053's completion commit/, "--head", git(dir, "rev-parse", "HEAD"));
});

test("a production deployment can never be recorded", () => {
  const { dir } = fixture();
  edit(dir, handoffPath("lovable"), (h) => { h.deployment = { allowed: true, environment: "production", status: "deployed", url: "https://example.invalid" }; });
  fails(dir, /\$\.deployment\.environment: "production" not in/);
});
