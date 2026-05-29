"use client";
import { DetailsSection } from "@/src/features/landing/components/DetailsSection";
import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useGetPropertyTaxonomy } from "../mutations/landing.mutation";
import { usePropertyStore } from "@/src/features/property/store/property.store";

export function LandingScreen() {
  const t = useTranslations("home");
  const { theme } = useTheme();
  const { propertyTaxonomy: storedPropertyTaxonomy } = usePropertyStore();
  const {
    data: fetchedPropertyTaxonomy,
    mutate: getPropertyTaxonomy,
    isPending: isLoading,
  } = useGetPropertyTaxonomy();
  const propertyTaxonomy = fetchedPropertyTaxonomy ?? storedPropertyTaxonomy ?? undefined;

  useEffect(() => {
    if (storedPropertyTaxonomy == null) {
      getPropertyTaxonomy();
    }
  }, [getPropertyTaxonomy, storedPropertyTaxonomy]);

  return (
    <>
      <HeroSection t={t} theme={theme} isLoading={isLoading} propertyTaxonomy={propertyTaxonomy} />
      <DetailsSection t={t} />
    </>
  );
}
