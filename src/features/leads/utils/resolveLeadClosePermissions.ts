import { LEAD_STATUSES_ALLOWING_REQUEST_CLOSE } from "../constants/leadStatus.constants";
import type { LeadStatus } from "../types/lead.types";

type ResolveLeadClosePermissionsParams = {
  isAdmin: boolean;
  isAgent: boolean;
  isAssignedAgent: boolean;
  status: LeadStatus | null;
  hasPendingCloseRequest: boolean;
};

export type LeadClosePermissions = {
  canRequestClose: boolean;
  canApproveOrRejectClose: boolean;
  canViewCloseStatus: boolean;
};

/**
 * Enforces the two-step close workflow in the UI:
 * an assigned agent or agency administrator requests closure, then an admin
 * approves or rejects it. Agents must not see internal close-status labels.
 * The backend must enforce the same rules on every close endpoint.
 */
export function resolveLeadClosePermissions({
  isAdmin,
  isAgent,
  isAssignedAgent,
  status,
  hasPendingCloseRequest,
}: ResolveLeadClosePermissionsParams): LeadClosePermissions {
  const canRequestFromCurrentStatus =
    status !== null &&
    LEAD_STATUSES_ALLOWING_REQUEST_CLOSE.includes(status);

  const canRequestClose =
    (isAdmin || (isAgent && isAssignedAgent)) &&
    canRequestFromCurrentStatus &&
    !hasPendingCloseRequest;

  return {
    canRequestClose,
    canApproveOrRejectClose: isAdmin && hasPendingCloseRequest,
    canViewCloseStatus: isAdmin,
  };
}
