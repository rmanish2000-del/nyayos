#!/usr/bin/env bash
# A-033 C-1 proof: two sessions write audit rows at the same time; the chain must stay linear.
# Usage: db/tests/audit_concurrency_0001.sh <container-name>
# Runs against a THROWAWAY local container that already has 0001_fma_foundation.sql applied.
# Never point this at a shared database.
set -euo pipefail
C="${1:?container name}"
export MSYS_NO_PATHCONV=1
psql() { docker exec "$C" psql -U postgres -tAq "$@"; }

T=$(psql -c "insert into nyayos.tenants (type, name) values ('personal', 'concurrency-probe') returning id")
log() { # actor request
  psql -c "set role nyayos_service_audit; $1 select nyayos.log_audit_event('user','$2',null,'$T',null,'auth.sign_in','session',null,null,'success','info','$3',null,'mobile','{}'::jsonb); $4" >/dev/null
}
# session 1 holds its transaction open for 6 s after inserting; session 2 inserts meanwhile.
log "begin;" "11111111-1111-4111-8111-111111111111" "cc-1" "select pg_sleep(6); commit;" &
sleep 2
log "" "22222222-2222-4222-8222-222222222222" "cc-2" ""
wait

echo "rows (seq | prev | row | request):"
psql -c "select seq || ' | ' || left(prev_hash,8) || ' | ' || left(row_hash,8) || ' | ' || request_id from nyayos.audit_events where request_id in ('cc-1','cc-2') order by seq"
# Pass criteria: no two rows share a predecessor, and the second concurrent row chains to the first.
# (A global verify_audit_chain() is reported for information only: the smoke suite's tamper test
#  deliberately breaks an earlier row when both are run on the same container.)
FORKS=$(psql -c "select count(*) from (select prev_hash from nyayos.audit_events group by prev_hash having count(*) > 1) f")
LINEAR=$(psql -c "select (b.prev_hash = a.row_hash)::text from nyayos.audit_events a, nyayos.audit_events b where a.request_id = 'cc-1' and b.request_id = 'cc-2'")
GLOBAL=$(psql -c "select coalesce(nyayos.verify_audit_chain()::text, 'intact')")
echo "forked predecessors: $FORKS ; second row chains to first: $LINEAR ; global verify_audit_chain: $GLOBAL"
if [ "$FORKS" = "0" ] && [ "$LINEAR" = "true" ]; then echo "CHECK C1_concurrent_writers_linear_chain PASS"; else echo "CHECK C1_concurrent_writers_linear_chain FAIL"; exit 1; fi
