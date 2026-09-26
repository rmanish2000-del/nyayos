#!/usr/bin/env bash
# A-033-R C-1 adversarial proof: concurrent audit writers under every isolation level plus a
# parallel burst. The chain must never fork (no two rows share a predecessor) and must verify.
# A writer that cannot be chained safely must FAIL (and roll back), never fork.
#
# Usage: db/tests/audit_concurrency_matrix.sh <container-name>
# Runs only against a THROWAWAY local container that already has the migrations applied.
# Synthetic data only. Never point this at a shared database.
set -uo pipefail
C="${1:?container name}"
export MSYS_NO_PATHCONV=1
q() { docker exec "$C" psql -U postgres -tAq -c "$1"; }
T=$(q "insert into nyayos.tenants (type, name) values ('personal', 'concurrency-matrix') returning id")
call() { # request_id
  echo "select nyayos.log_audit_event('user','11111111-1111-4111-8111-111111111111',null,'$T',null,'auth.sign_in','session',null,null,'success','info','$1',null,'mobile','{}'::jsonb);"
}
check() { # label
  local forks verify
  forks=$(q "select count(*) from (select prev_hash from nyayos.audit_events group by prev_hash having count(*) > 1) f")
  verify=$(q "select coalesce(nyayos.verify_audit_chain()::text, 'intact')")
  if [ "$forks" = "0" ] && [ "$verify" = "intact" ]; then echo "CHECK C1_$1 PASS (forked predecessors 0, chain $verify)";
  else echo "CHECK C1_$1 FAIL (forked predecessors $forks, first broken seq $verify)"; FAILED=1; fi
}
FAILED=0

pair() { # isolation label
  local iso="$1" label="$2"
  # Session 1 inserts, then holds its transaction open. Session 2 starts its transaction (and,
  # for snapshot isolation levels, takes its snapshot) BEFORE session 1 commits.
  docker exec "$C" psql -U postgres -q -v ON_ERROR_STOP=1 -c "set role nyayos_service_audit; begin isolation level $iso; $(call "$label-1") select pg_sleep(5); commit;" >/dev/null 2>&1 &
  sleep 1.5
  S2=$(docker exec "$C" psql -U postgres -q -v ON_ERROR_STOP=1 -c "set role nyayos_service_audit; begin isolation level $iso; select 1; $(call "$label-2") commit;" 2>&1 >/dev/null)
  wait
  local rows
  rows=$(q "select count(*) from nyayos.audit_events where request_id like '$label-%'")
  if [ -n "$S2" ]; then echo "  $label: session 2 rejected and rolled back (fail closed): $(echo "$S2" | grep -m1 -oE 'ERROR: .*' | cut -c1-110)"; fi
  echo "  $label: rows committed $rows/2"
  check "$label"
}

pair "read committed" "read_committed_pair"
pair "repeatable read" "repeatable_read_pair"
pair "serializable" "serializable_pair"

# Parallel burst: 10 read-committed sessions x 5 inserts each, started together.
for i in $(seq 1 10); do
  ( for j in $(seq 1 5); do docker exec "$C" psql -U postgres -q -c "set role nyayos_service_audit; $(call "burst-$i-$j")" >/dev/null 2>&1; done ) &
done
wait
echo "  burst: rows committed $(q "select count(*) from nyayos.audit_events where request_id like 'burst-%'")/50"
check "parallel_burst_10x5"

# Server-function burst (A-038): 5 users concurrently sign up and create 3 disputes each. Every
# canonical write carries its audit event in the same transaction; the chain must stay linear.
for i in 1 2 3 4 5; do
  ( docker exec "$C" psql -U postgres -q -v ON_ERROR_STOP=1 -c "set role nyayos_authenticated; set nyayos.principal_id = 'b5b5b5b5-0000-4000-8000-00000000000$i'; set nyayos.request_id = 'sfburst-$i'; select nyayos.create_dispute(nyayos.sign_up_personal_tenant('Synthetic burst $i', 'en'), 'Synthetic burst dispute a'); select nyayos.create_dispute(nyayos.sign_up_personal_tenant('Synthetic burst $i', 'en'), 'Synthetic burst dispute b'); select nyayos.create_dispute(nyayos.sign_up_personal_tenant('Synthetic burst $i', 'en'), 'Synthetic burst dispute c');" >/dev/null 2>&1 ) &
done
wait
echo "  server-function burst: audit events $(q "select count(*) from nyayos.audit_events where request_id like 'sfburst-%'")/20, disputes $(q "select count(*) from nyayos.disputes where title like 'Synthetic burst dispute %'")/15"
check "server_function_burst_5x4"

exit $FAILED
