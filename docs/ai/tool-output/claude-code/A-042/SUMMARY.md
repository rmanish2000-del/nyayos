# A-042 — Minor finding m-1 closure (`claude-code`)

**Backfilled by A-044-R** from repository evidence. Completion commit `fc740380eb6282d3b6a174b8a01a93e7528bddd8` on `feature/fma-foundation-v1`.

A-032 m-1 is closed. It was reproduced on migrations 0001–0007: the owner and an editor could set `disputes.status` directly. Migration `0008_dispute_status_authorization.sql` removes the client grant and makes status follow the deletion workflow only (request sets `deletion_requested`, undo sets `active`, audited). Dispute status suite 21/21 (fails on the baseline), smoke 87/87, every regression suite and Vitest 199/199 passed. Nothing deployed. Remaining: A-032 minors m-2 to m-12 (non-blocking).

Machine-readable record: [HANDOFF.json](HANDOFF.json).
