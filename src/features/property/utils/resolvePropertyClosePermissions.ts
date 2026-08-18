const PROPERTY_CLOSE_STATUS_KEYS = new Set([
  "deal_closure_requested",
  "deal-closure-requested",
  "deal_closed",
  "deal-closed",
]);

export type PropertyClosePermissions = {
  canViewCloseStatus: boolean;
};

export function resolvePropertyClosePermissions(
  isAdmin: boolean,
): PropertyClosePermissions {
  return {
    canViewCloseStatus: isAdmin,
  };
}

function normalizePropertyCloseStatusKey(statusKey: string): string {
  return statusKey.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

export function isPropertyCloseStatusKey(statusKey: string): boolean {
  const normalized = normalizePropertyCloseStatusKey(statusKey);
  return PROPERTY_CLOSE_STATUS_KEYS.has(normalized);
}

/** Masks deal-closure statuses for agents while preserving listing workflow. */
export function maskPropertyListingStatusKeyForViewer(
  statusKey: string,
  canViewCloseStatus: boolean,
): string {
  if (canViewCloseStatus || !isPropertyCloseStatusKey(statusKey)) {
    return statusKey;
  }

  return "active";
}
