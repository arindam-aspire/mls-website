"use client";

import { useAgentListingsTable } from "./useAgentListingsTable";

export function useListingPropertyScreen() {
  return useAgentListingsTable({ listingsNamespace: "myListings" });
}
