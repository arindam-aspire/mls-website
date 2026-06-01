import heroImage from "@/src/assets/images/MLS_Home_Image.png";
import type { LocationTaxonomyResponse } from "@/src/features/landing/types/locationTaxonomy.types";
import type { PropertyTaxonomyResponse } from "@/src/features/landing/types/propertyTaxonomy.types";
import { cn } from "@/src/lib/cn";
import {
  landingHeroEyebrowClasses,
  landingHeroTaglineClasses,
  landingHeroTitleClasses,
} from "@/src/lib/typography";
import { HeroSearchBar } from "./HeroSearchBar";

type HeroSectionProps = {
  t: (key: string) => string;
  theme: string;
  isLoading: boolean;
  propertyTaxonomy?: PropertyTaxonomyResponse;
  locationTaxonomy?: LocationTaxonomyResponse;
};

export function HeroSection({
  t,
  theme,
  isLoading,
  propertyTaxonomy,
  locationTaxonomy,
}: HeroSectionProps) {
  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat py-24 sm:py-28 lg:py-32"
      style={{ backgroundImage: `url(${heroImage.src})` }}
      aria-label={t("heroImageAlt")}
    >
      <div
        className="absolute inset-0 bg-black/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-2 px-4 text-center sm:gap-3 sm:px-6">
        <p className={cn("text-tertiary", landingHeroEyebrowClasses)}>
          {t("heroEyebrow")}
        </p>

        <div className="flex flex-col gap-0">
          <h1 className={cn("text-hero-on-image", landingHeroTitleClasses)}>
            {t("heroTitleLine1")}
          </h1>

          <p className={cn("text-tertiary italic", landingHeroTitleClasses)}>
            {t("heroTitleLine2")}
          </p>
        </div>

        <p className={cn("text-hero-on-image", landingHeroTaglineClasses)}>
          {t("heroTagline")}
        </p>

        <div className="w-full min-w-0">
          <HeroSearchBar
            t={t}
            theme={theme}
            isLoading={isLoading}
            propertyTaxonomy={propertyTaxonomy}
            locationTaxonomy={locationTaxonomy}
          />
        </div>
      </div>
    </section>
  );
}
