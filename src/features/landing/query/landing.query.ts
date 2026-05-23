"use client";

import { useQuery } from "@tanstack/react-query";
import { getPropertyTaxonomy } from "@/src/features/landing/services/landing.service";

export const landingQueryKeys = {
  all: ["landing"] as const,
  propertyTaxonomy: () =>
    [...landingQueryKeys.all, "property-taxonomy"] as const,
};

export function usePropertyTaxonomy() {
  return useQuery({
    queryKey: landingQueryKeys.propertyTaxonomy(),
    queryFn: getPropertyTaxonomy,
  });
}
