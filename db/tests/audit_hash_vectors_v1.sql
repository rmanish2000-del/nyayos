-- A-038 M-2: PostgreSQL must reproduce every frozen golden vector exactly (contract nyayos-audit-v1).
-- Run on a disposable container after migrations 0001-0005, with the vectors file copied to /tmp.
-- Each vector is checked under two session time zones to prove the hash does not depend on TimeZone.
\set ON_ERROR_STOP on
\pset tuples_only on
\pset format unaligned
\set vectors `cat /tmp/audit_hash_vectors_v1.json`

create temp table vec as
  select ord, v from jsonb_array_elements((:'vectors'::jsonb) -> 'vectors') with ordinality t(v, ord);

create function pg_temp.vector_row(i jsonb) returns nyayos.audit_events language sql stable as $f$
  select jsonb_populate_record(null::nyayos.audit_events, jsonb_build_object(
    'id', i->'id', 'occurred_at', i->'occurredAt', 'actor_type', i->'actorType', 'actor_id', i->'actorId',
    'on_behalf_of', i->'onBehalfOf', 'tenant_id', i->'tenantId', 'dispute_id', i->'disputeId', 'grant_id', i->'grantId',
    'action', i->'action', 'resource_type', i->'resourceType', 'resource_id', i->'resourceId', 'purpose', i->'purpose',
    'outcome', i->'outcome', 'severity', i->'severity', 'request_id', i->'requestId', 'ip_hash', i->'ipHash',
    'user_agent_class', i->'userAgentClass', 'metadata', i->'metadata'))
$f$;

set timezone = 'Asia/Kolkata';
select 'CHECK VEC_' || (v ->> 'name') || '_sql_matches_frozen ' ||
  case when nyayos.audit_canonical_v1(pg_temp.vector_row(v -> 'input')) = v #>> '{expected,canonical}'
        and nyayos.audit_row_hash_v1(v ->> 'prevHash', nyayos.audit_canonical_v1(pg_temp.vector_row(v -> 'input'))) = v #>> '{expected,rowHash}'
       then 'PASS' else 'FAIL' end
from vec order by ord;

set timezone = 'America/Los_Angeles';
select 'CHECK VEC_all_vectors_timezone_independent ' ||
  case when bool_and(nyayos.audit_row_hash_v1(v ->> 'prevHash', nyayos.audit_canonical_v1(pg_temp.vector_row(v -> 'input'))) = v #>> '{expected,rowHash}')
       then 'PASS' else 'FAIL' end
from vec;

select 'CHECK VEC_chain_links_resolve ' ||
  case when (select count(*) from vec a join vec b on (b.v ->> 'prevHash') = (a.v #>> '{expected,rowHash}')) = 2 then 'PASS' else 'FAIL' end;
select 'CHECK VEC_count_at_least_12 ' || case when (select count(*) from vec) >= 12 then 'PASS' else 'FAIL' end;
reset timezone;
