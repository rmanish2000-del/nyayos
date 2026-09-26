#!/usr/bin/env node
/**
 * NyayOS schema lint — static form of SEC-RLS-01 and SEC-DEL-06 (FM-A Scope Sheet §8.1).
 *
 * For every `create table nyayos.<name>` in db/migrations/*.sql, require in the same file:
 *   - alter table nyayos.<name> enable row level security
 *   - alter table nyayos.<name> force row level security
 *   - revoke all on nyayos.<name> from public
 *   - at least one grant on nyayos.<name>
 *   - at least one create policy … on nyayos.<name>
 *   - a deletion_allowlist row ('<name>', …)
 * Cross-checks the table set against app/src/domain/tables.ts (the TypeScript twin) and
 * asserts that no table named in NOT_CREATED_IN_FMA exists (CR-1).
 *
 * Exit 0 = clean. Exit 1 = findings printed. No database connection is made.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(new URL("../..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const migrationsDir = join(root, "db", "migrations");
const tablesTs = readFileSync(join(root, "app", "src", "domain", "tables.ts"), "utf8");

const findings = [];
const sqlTables = new Set();
const canonicalNoWriteGrant = [
  "dispute_statements", "entities", "entity_source_forms", "events", "date_assertions", "propositions",
  "evidence_items", "evidence_relations", "contradictions", "missing_evidence", "issues", "next_steps",
  "user_corrections", "audit_events",
];

for (const file of readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort()) {
  const sql = readFileSync(join(migrationsDir, file), "utf8");
  const lower = sql.toLowerCase();
  const names = [...lower.matchAll(/create table (?:if not exists )?nyayos\.([a-z_]+)/g)].map((m) => m[1]);
  for (const name of names) {
    sqlTables.add(name);
    const req = {
      "enable row level security": new RegExp(`alter table nyayos\\.${name} enable row level security`),
      "force row level security": new RegExp(`alter table nyayos\\.${name} force row level security`),
      "revoke all from public": new RegExp(`revoke all on nyayos\\.${name} from public`),
      "at least one grant": new RegExp(`grant [a-z, ()_]+ on nyayos\\.${name} to`),
      "at least one policy": new RegExp(`create policy [a-z_]+ on nyayos\\.${name}\\b`),
      "deletion_allowlist row": new RegExp(`\\('${name}', (null|'[a-z_]+'), (true|false)\\)`),
    };
    for (const [label, re] of Object.entries(req)) {
      if (!re.test(lower)) findings.push(`${file}: table ${name} — missing ${label}`);
    }
    if (canonicalNoWriteGrant.includes(name)) {
      const writeGrant = new RegExp(`grant [a-z, ()_]*\\b(insert|update|delete)\\b[a-z, ()_]* on nyayos\\.${name} to nyayos_authenticated`);
      if (writeGrant.test(lower)) findings.push(`${file}: table ${name} — authenticated write grant on a single-writer/append-only table (AC-M1-03, S3/S7)`);
    }
  }
  if (!/^\s*begin;/m.test(lower) || !/^\s*commit;\s*$/m.test(lower)) findings.push(`${file}: migration is not wrapped in begin/commit`);
  const nonSchemaTables = [...lower.matchAll(/create table (?:if not exists )?(?!nyayos\.)([a-z_.]+)/g)].map((m) => m[1]);
  for (const t of nonSchemaTables) findings.push(`${file}: table ${t} created outside the nyayos schema`);
}

// Twin check against app/src/domain/tables.ts
const tsTables = new Set([...tablesTs.matchAll(/^\s*t\("([a-z_]+)"/gm)].map((m) => m[1]));
const notCreated = new Set(
  [...(tablesTs.match(/NOT_CREATED_IN_FMA = \[([\s\S]*?)\]/)?.[1] ?? "").matchAll(/"([a-z_]+)"/g)].map((m) => m[1]),
);
for (const t of tsTables) if (!sqlTables.has(t)) findings.push(`tables.ts declares ${t} but no migration creates it`);
for (const t of sqlTables) if (!tsTables.has(t)) findings.push(`migration creates ${t} but tables.ts does not declare it`);
for (const t of notCreated) if (sqlTables.has(t)) findings.push(`${t} is created but is listed in NOT_CREATED_IN_FMA (CR-1)`);

// Deletion scope graph (A-039): SQL deletion_graph_v1() and TS DELETION_GRAPH must match exactly,
// and every table must have at least one decision.
const graphSql = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort()
  .map((f) => readFileSync(join(migrationsDir, f), "utf8"))
  .filter((s) => s.includes("function nyayos.deletion_graph_v1()"))
  .pop() ?? "";
const edgeKey = (m) => `${m[1]}|${m[2]}|${m[3]}|${m[4]}`;
const sqlEdges = new Set([...graphSql.matchAll(/\('([a-z_]+)', '(dispute|document|account|none)', '([^']+)', '([a-z_]+)', '[^']*'\)/g)].map(edgeKey));
const deletionTs = readFileSync(join(root, "app", "src", "domain", "deletion.ts"), "utf8");
const tsEdges = new Set([...deletionTs.matchAll(/\be\(\s*"([a-z_]+)",\s*"(dispute|document|account|none)",\s*"([^"]+)",\s*"([a-z_]+)",/g)].map(edgeKey));
if (graphSql === "") findings.push("no migration defines nyayos.deletion_graph_v1()");
for (const k of sqlEdges) if (!tsEdges.has(k)) findings.push(`deletion graph edge in SQL but not in deletion.ts: ${k}`);
for (const k of tsEdges) if (!sqlEdges.has(k)) findings.push(`deletion graph edge in deletion.ts but not in SQL: ${k}`);
const graphTables = new Set([...sqlEdges].map((k) => k.split("|")[0]));
for (const t of sqlTables) if (!graphTables.has(t)) findings.push(`table ${t} has no deletion graph decision`);

// Purge order (A-040): SQL deletion_purge_order_v1() and TS DELETION_PURGE_ORDER must match exactly,
// and every table the graph can classify purge_candidate must be in it.
const orderSql = readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort()
  .map((f) => readFileSync(join(migrationsDir, f), "utf8"))
  .filter((s) => s.includes("function nyayos.deletion_purge_order_v1()"))
  .pop() ?? "";
const sqlOrder = [...(orderSql.match(/function nyayos\.deletion_purge_order_v1\(\)[\s\S]*?array\[([\s\S]*?)\]::text\[\]/)?.[1] ?? "")
  .matchAll(/'([a-z_]+)'/g)].map((m) => m[1]);
const tsOrder = [...(deletionTs.match(/DELETION_PURGE_ORDER = \[([\s\S]*?)\] as const/)?.[1] ?? "").matchAll(/"([a-z_]+)"/g)]
  .map((m) => m[1]);
if (orderSql === "") findings.push("no migration defines nyayos.deletion_purge_order_v1()");
if (sqlOrder.join(",") !== tsOrder.join(",")) {
  findings.push(`purge order differs: SQL [${sqlOrder.join(", ")}] vs deletion.ts [${tsOrder.join(", ")}]`);
}
for (const k of sqlEdges) {
  const [table, , , cls] = k.split("|");
  if (cls === "purge_candidate" && !sqlOrder.includes(table)) findings.push(`purge candidate table ${table} missing from the purge order`);
}

const summary = `schema-lint: ${sqlTables.size} tables in SQL, ${tsTables.size} in tables.ts, ${notCreated.size} deferred names checked, ${sqlEdges.size} deletion-graph edges (SQL = TS), ${sqlOrder.length}-table purge order (SQL = TS)`;
if (findings.length) {
  console.error(summary);
  for (const f of findings) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`${summary} — clean`);
