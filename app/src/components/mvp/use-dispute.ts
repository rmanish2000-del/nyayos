import { useParams } from "@tanstack/react-router";

import { disputeForUser } from "@/mvp/access";
import type { SeedDispute } from "@/mvp/fixtures";
import { useMvp } from "@/mvp/store";

/** The current route's dispute, or null when this user may not open it. */
export function useDispute(): SeedDispute | null {
  const { disputeId } = useParams({ strict: false });
  const { user, data } = useMvp();
  if (!user || !disputeId) return null;
  return disputeForUser(user, data.disputes, disputeId);
}
