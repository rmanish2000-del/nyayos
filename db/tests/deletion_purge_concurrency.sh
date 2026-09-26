#!/usr/bin/env bash
# A-040 M-3: two workers racing on the same deletion request purge it exactly once.
# Usage: db/tests/deletion_purge_concurrency.sh <container>
# The container must hold migrations 0001-0007 (fresh or not; each round creates its own synthetic dispute).
# For each isolation level, worker 1 purges and holds its transaction open; worker 2 starts meanwhile, blocks on
# the request row lock, and must then see the purge (already_purged) or fail with a serialization error.
# Either way: one purge, one tombstone, one deletion.purged audit event, audit chain intact.
set -uo pipefail
export MSYS_NO_PATHCONV=1
C="$1"
PSQL=(docker exec -i "$C" psql -U postgres -v ON_ERROR_STOP=1 -qtA)
total=0; passed=0
for iso in "read committed" "repeatable read" "serializable"; do
  total=$((total + 1))
  u="d1d1d1d1-0000-4000-8000-$(printf '%012d' $total)"
  req=$("${PSQL[@]}" <<SQL
set role nyayos_authenticated; set nyayos.principal_id = '$u';
select nyayos.sign_up_personal_tenant('Synthetic racer', 'en') \gset t_
select nyayos.create_dispute(:'t_sign_up_personal_tenant', 'Synthetic race dispute') \gset d_
select nyayos.request_deletion('dispute', :'d_create_dispute');
SQL
)
  req=$(echo "$req" | tail -1)
  "${PSQL[@]}" -c "update nyayos.deletion_requests set undo_until = now() - interval '1 minute' where id = '$req'" >/dev/null
  out1=$(mktemp); out2=$(mktemp)
  ( "${PSQL[@]}" > "$out1" 2>&1 <<SQL
begin isolation level $iso;
set local role nyayos_service_deletion;
select outcome from nyayos.purge_deletion_request('$req');
select pg_sleep(2);
commit;
SQL
  ) &
  p1=$!
  sleep 0.7
  ( "${PSQL[@]}" > "$out2" 2>&1 <<SQL
begin isolation level $iso;
set local role nyayos_service_deletion;
select outcome from nyayos.purge_deletion_request('$req');
commit;
SQL
  ) &
  p2=$!
  wait $p1; wait $p2
  r1=$(grep -E '^(purged|incomplete|already_purged)' "$out1" | head -1)
  r2=$(grep -E '^(purged|incomplete|already_purged)|could not serialize' "$out2" | head -1)
  facts=$("${PSQL[@]}" -c "select (select count(*) from nyayos.deletion_ledger l join nyayos.deletion_requests r on r.scope_id = l.scope_id where r.id = '$req')
    || ':' || (select count(*) from nyayos.audit_events where action = 'deletion.purged' and resource_id = '$req')
    || ':' || (select state from nyayos.deletion_requests where id = '$req')
    || ':' || coalesce(nyayos.verify_audit_chain()::text, 'intact')")
  if [ "$r1" = "purged" ] && { [ "$r2" = "already_purged" ] || echo "$r2" | grep -q 'could not serialize'; } && [ "$facts" = "1:1:purged:intact" ]; then
    echo "CHECK M3_concurrent_duplicate_purge_${iso// /_} PASS (worker1=$r1 worker2=${r2:0:40} ledger:audit:state:chain=$facts)"
    passed=$((passed + 1))
  else
    echo "CHECK M3_concurrent_duplicate_purge_${iso// /_} FAIL (worker1=$r1 worker2=$r2 facts=$facts)"
    cat "$out1" "$out2"
  fi
  rm -f "$out1" "$out2"
done
echo "SUMMARY deletion_purge_concurrency $passed/$total"
[ "$passed" -eq "$total" ]
