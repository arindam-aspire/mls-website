"use client";
import { DetailsSection } from "@/src/features/landing/components/DetailsSection";
import { HeroSection } from "@/src/features/landing/components/HeroSection";
import { usePropertyTaxonomy } from "../query/landing.query";
import { useTranslations } from "next-intl";
import { useTheme } from "@/src/providers/ThemeProvider";
import { useEffect } from "react";
import { useToast } from "@/src/hooks/useToast";

export function LandingScreen() {
  const t = useTranslations("home");
  const { theme } = useTheme();
  const { data: propertyTaxonomy, isLoading, error } = usePropertyTaxonomy();
  const toast = useToast();

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.error("Error", { description: error.message });
    }
  }, [error, propertyTaxonomy]);

  return (
    <>
      <HeroSection t={t} theme={theme} isLoading={isLoading} propertyTaxonomy={propertyTaxonomy} />
      <DetailsSection t={t} />
    </>
  );
}
