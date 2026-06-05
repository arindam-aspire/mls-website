/** Shared mobile header sizing for `ProtectedHeader` and protected mobile drawer. */
export const protectedMobileHeaderContainerClass =
  "container mx-auto w-full px-4 sm:px-5";

/** Bar layout inside the drawer primary header (logo + close). */
export const protectedDrawerHeaderBarClass =
  "flex h-16 shrink-0 items-center justify-between gap-2 sm:h-20 sm:gap-3";

export const protectedDrawerLogoLinkClass =
  "inline-flex min-w-0 shrink overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:max-w-[55%]";

export const protectedDrawerLogoImageClass =
  "h-20 w-auto max-w-full object-contain object-left transition-opacity duration-300 sm:h-[4.25rem]";

export const protectedDrawerSectionsContainerClass =
  `${protectedMobileHeaderContainerClass} flex flex-col gap-5 py-4 sm:gap-6 sm:py-5`;

export const protectedDrawerFooterClass =
  `${protectedMobileHeaderContainerClass} py-3 sm:py-4`;

export const protectedMobileHeaderBarClass =
  "flex h-16 shrink-0 items-center justify-between gap-2 sm:h-20 sm:gap-3";

export const protectedMobileLogoLinkClass =
  "inline-flex min-w-0 shrink overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:max-w-[55%]";

export const protectedMobileLogoImageClass =
  "h-16 w-auto max-w-full object-contain object-center sm:h-[4.25rem]";

export const protectedMobileHeaderIconButtonClass =
  "inline-flex !size-9 shrink-0 items-center justify-center !gap-0 !rounded-lg !px-0 !py-0 text-text transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:!size-11";

export const protectedMobileHeaderIconClass = "size-6";
