"use client";
import { DetailsSection } from "@/src/features/landing/components/DetailsSection";
import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/src/providers/ThemeProvider";
import {
  useGetLocationTaxonomy,
  useGetPropertyTaxonomy,
} from "../mutations/landing.mutation";
import { usePropertyStore } from "@/src/features/property/store/property.store";

export function LandingScreen() {
  const t = useTranslations("home");
  const { theme } = useTheme();
  const {
    propertyTaxonomy: storedPropertyTaxonomy,
    locationTaxonomy: storedLocationTaxonomy,
  } = usePropertyStore();
  const {
    data: fetchedPropertyTaxonomy,
    mutate: getPropertyTaxonomy,
    isPending: isPropertyTaxonomyLoading,
  } = useGetPropertyTaxonomy();
  const {
    data: fetchedLocationTaxonomy,
    mutate: getLocationTaxonomy,
    isPending: isLocationTaxonomyLoading,
  } = useGetLocationTaxonomy();
  const propertyTaxonomy = fetchedPropertyTaxonomy ?? storedPropertyTaxonomy ?? undefined;
  const locationTaxonomy =
    fetchedLocationTaxonomy ?? storedLocationTaxonomy ?? undefined;
  const isLoading = isPropertyTaxonomyLoading || isLocationTaxonomyLoading;

  useEffect(() => {
    if (storedPropertyTaxonomy == null) {
      getPropertyTaxonomy();
    }
  }, [getPropertyTaxonomy, storedPropertyTaxonomy]);

  useEffect(() => {
    if (storedLocationTaxonomy == null) {
      getLocationTaxonomy();
    }
  }, [getLocationTaxonomy, storedLocationTaxonomy]);

  return (
    <>
      <HeroSection
        t={t}
        theme={theme}
        isLoading={isLoading}
        propertyTaxonomy={propertyTaxonomy}
        locationTaxonomy={locationTaxonomy}
      />
      <DetailsSection t={t} />
    </>
  );
}
