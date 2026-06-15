import type { AgencyListItem } from "../types/profile.types";

export function filterAgenciesBySearch(
  agencies: AgencyListItem[],
  query: string,
): AgencyListItem[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return agencies;
  }

  return agencies.filter((agency) => {
    const haystack = [agency.agency_name, agency.email, agency.phone]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
