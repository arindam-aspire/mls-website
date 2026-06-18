/** Shared mobile header sizing for `PublicHeader` and `PublicMobileMenu`. */
import {
  headerIconButtonClass,
  headerIconGlyphClass,
} from "@/src/layouts/shared/headerIconButtonStyles";

export const publicMobileHeaderContainerClass =
  "container mx-auto w-full px-4 sm:px-5";

export const publicMobileHeaderBarClass =
  "flex h-16 shrink-0 items-center justify-between gap-2 sm:h-20 sm:gap-3";

export const publicMobileLogoLinkClass =
  "inline-flex min-w-0 shrink overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:max-w-[55%]";

export const publicMobileLogoImageClass =
  "h-20 w-auto max-w-full object-contain object-left transition-opacity duration-300 sm:h-[4.25rem]";

export const publicMobileHeaderIconButtonClass = headerIconButtonClass;

export const publicMobileHeaderIconClass = headerIconGlyphClass;
