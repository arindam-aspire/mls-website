"use client";
import { DetailsSection } from "@/src/features/landing/components/DetailsSection";
import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { usePropertyTaxonomy } from "../query/landing.query";
import { useTranslations } from "next-intl";
import { useTheme } from "@/src/providers/ThemeProvider";

export function LandingScreen() {
  const t = useTranslations("home");
  const { theme } = useTheme();
  const { data: propertyTaxonomy, isLoading } = usePropertyTaxonomy();

  return (
    <>
      <HeroSection t={t} theme={theme} isLoading={isLoading} propertyTaxonomy={propertyTaxonomy} />
      <DetailsSection t={t} />
    </>
  );
}
