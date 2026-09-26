-- A-038 M-2: produce a chain written by the PostgreSQL trigger, for the TypeScript verifier.
-- Run on a FRESH disposable container after migrations 0001-0005. Synthetic data only.
-- Output: one JSON array (row_to_json of nyayos.audit_events ordered by seq) on stdout, rendered in
-- a non-UTC session time zone on purpose, so the TypeScript side must normalise timestamps.
-- Regenerate the fixture with:
--   psql -U postgres -q -f audit_interop_export.sql > app/tests/fixtures/audit_chain_sql_export_v1.json
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned
\o /dev/null

create temp table x (tenant uuid, dispute uuid, p_ok uuid, p_rej uuid);
insert into x default values;
grant all on x to public;

set role nyayos_authenticated;
set nyayos.principal_id = 'f1f1f1f1-0000-4000-8000-000000000001';
set nyayos.request_id = 'interop-signup';
update x set tenant = nyayos.sign_up_personal_tenant('Synthetic interop', 'hi');
set nyayos.request_id = 'interop-dispute';
update x set dispute = nyayos.create_dispute((select tenant from x), 'Synthetic interop dispute');
set nyayos.request_id = 'interop-propose';
update x set p_ok = nyayos.propose_change((select dispute from x), 'event', null,
  '{"text":"Synthetic event","origin_type":"user_statement","source_ref":{"kind":"user_entry","enteredBy":"f1f1f1f1-0000-4000-8000-000000000001"}}'::jsonb, null);
set nyayos.request_id = 'interop-accept';
select nyayos.decide_proposal((select p_ok from x), true, null);
set nyayos.request_id = 'interop-propose-2';
update x set p_rej = nyayos.propose_change((select dispute from x), 'event', null,
  '{"text":"Synthetic event 2","origin_type":"user_statement","source_ref":{"kind":"user_entry","enteredBy":"f1f1f1f1-0000-4000-8000-000000000001"}}'::jsonb, null);
set nyayos.request_id = 'interop-reject';
select nyayos.decide_proposal((select p_rej from x), false, 'synthetic reason');
set nyayos.request_id = 'interop-delete';
select nyayos.request_deletion('dispute', (select dispute from x));

reset role;
set role nyayos_service_audit;
select nyayos.log_audit_event('service', 'scan_worker', 'f1f1f1f1-0000-4000-8000-000000000001', (select tenant from x), (select dispute from x),
  'document.scan_result', 'quarantine_upload', null, 'storage', 'success', 'info', 'interop-scan', 'b' || repeat('0', 63), 'service',
  '{"verdict":"clean","reason_code":"हिंदी — परीक्षण 📄 \"q\" \\ \n","size_bytes":9007199254740991,"purpose_checked":true}'::jsonb);
select nyayos.log_audit_event('system', 'system', null, null, null, 'auth.sign_in', 'session', null, null, 'denied', 'low',
  'interop-nulls', null, 'unknown', '{}'::jsonb);
reset role;

\o
set timezone = 'Asia/Kolkata';
select json_agg(row_to_json(a) order by a.seq) from nyayos.audit_events a;
