/** Shared mobile header sizing for `LandingHeader` and `LandingMobileMenu`. */
import {
  headerIconButtonClass,
  headerIconGlyphClass,
} from "@/src/layouts/shared/headerIconButtonStyles";

export const landingMobileHeaderContainerClass =
  "container mx-auto w-full px-4 sm:px-5";

export const landingMobileHeaderBarClass =
  "flex h-16 shrink-0 items-center justify-between gap-2 sm:h-20 sm:gap-3";

export const landingMobileLogoLinkClass =
  "inline-flex min-w-0 shrink overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:max-w-[55%]";

export const landingMobileLogoImageClass =
  "h-20 w-auto max-w-full object-contain object-left transition-opacity duration-300 sm:h-[4.25rem]";

export const landingMobileHeaderIconButtonClass = headerIconButtonClass;

export const landingMobileHeaderIconClass = headerIconGlyphClass;
