export type TypographySizeTier = "sm" | "md" | "lg";

/** Control/body text inside buttons, inputs, selects, toggles. */
export const controlTextClasses: Record<TypographySizeTier, string> = {
  sm: "text-xs leading-none sm:text-sm sm:leading-normal",
  md: "text-xs leading-none sm:text-sm sm:leading-normal lg:text-base",
  lg: "text-sm leading-none sm:text-base sm:leading-normal",
};

export const fieldLabelSizeClasses =
  "mb-1 block text-xs font-medium text-text sm:mb-1.5 sm:text-sm";

export const fieldErrorSizeClasses =
  "mt-1 text-xs text-danger sm:mt-1.5 sm:text-sm";

export const fieldHintSizeClasses =
  "mt-1 text-xs text-muted sm:mt-1.5 sm:text-sm";

export const textDropdownOptionClasses = "text-xs leading-5 sm:text-sm lg:text-base";

export const textDropdownPanelClasses = "text-xs leading-5 sm:text-sm lg:text-base";

export const bodyTextClasses = "text-xs sm:text-sm";

export const bodySmallTextClasses = "text-[11px] sm:text-sm";

export const bodyLargeTextClasses = "text-sm sm:text-base";

export const captionTextClasses = bodySmallTextClasses;

export const headingPageClasses =
  "text-lg font-semibold leading-tight text-text sm:text-xl";

export const headingAuthClasses =
  "text-xl font-bold text-secondary sm:text-2xl";

export const headingSectionClasses =
  "text-base font-semibold text-text sm:text-lg";

export const sheetTitleClasses = headingSectionClasses;

export const modalTitleClasses = headingPageClasses;

export const modalDescriptionClasses =
  "mt-1.5 text-[11px] text-muted sm:text-sm";

export const cardTitleClasses = headingPageClasses;

export const cardDescriptionClasses = bodyTextClasses;

export const popoverTitleClasses =
  "text-[11px] font-semibold leading-tight text-text sm:text-sm";

export const popoverPanelTextClasses = bodySmallTextClasses;

export const toastTitleClasses = "text-xs font-medium sm:text-sm";

export const toastDescriptionClasses = bodySmallTextClasses;

export const navBrandClasses = "text-lg font-semibold";

export const navLinkClasses = bodyTextClasses;

export const navMenuItemClasses = "text-base font-medium";

export const navDesktopLinkClasses = "text-sm font-medium";

export const profileNameClasses = "text-sm font-semibold";

export const profileEmailClasses = "text-xs sm:text-sm";

export const navDrawerLinkClasses = bodyLargeTextClasses;

export const footerTextClasses = bodySmallTextClasses;

export const footerHeadingClasses = bodyTextClasses;

export const avatarTextClasses: Record<TypographySizeTier, string> = {
  sm: "text-xs sm:text-sm",
  md: "text-xs sm:text-sm lg:text-base",
  lg: "text-sm sm:text-base lg:text-lg",
};

export const overlineLabelClasses =
  "text-[10px] font-semibold uppercase tracking-[0.16em] text-text/70 sm:text-[11px]";

export const currencyBadgeTextClasses =
  "text-[11px] font-medium sm:text-xs";

export const checkboxLabelClasses = bodySmallTextClasses;

/** Decorative serif display heading used across marketing/empty-state sections. */
export const displayHeadingClasses =
  "font-serif text-3xl leading-tight text-text sm:text-4xl lg:text-5xl";

/** Uppercase eyebrow above marketing section titles. */
export const displayEyebrowClasses =
  "text-xs font-bold uppercase tracking-[0.2em] text-secondary-dark sm:text-sm";

/** Lead/marketing paragraph (larger than standard body). */
export const displayLeadClasses = "text-base leading-relaxed sm:text-lg";

/** Small tracked caption used beside marketing icons. */
export const displayCaptionClasses = "text-xs tracking-wide sm:text-sm";

export const heroTitleClasses =
  "text-2xl font-bold text-text sm:text-3xl lg:text-4xl";

export const heroSubtitleClasses = bodyLargeTextClasses;

export const landingSectionTitleClasses = displayHeadingClasses;

export const landingSectionBodyClasses = displayLeadClasses;

export const comingSoonTitleClasses = displayHeadingClasses;

export const comingSoonBodyClasses = displayLeadClasses;

export const notFoundTitleClasses = displayHeadingClasses;

export const notFoundBodyClasses = displayLeadClasses;

export const notFoundCodeClasses =
  "text-4xl font-bold leading-none text-secondary sm:text-5xl";

/** Serif display title used inside the upcoming-feature modal. */
export const displayModalTitleClasses = "font-serif text-2xl sm:text-3xl";

/** Large serif hero headline on the landing page. */
export const landingHeroTitleClasses =
  "font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl";

/** Uppercase eyebrow above the landing hero headline. */
export const landingHeroEyebrowClasses =
  "text-xs font-medium uppercase tracking-[0.28em] sm:text-sm";

/** Uppercase tagline below the landing hero headline. */
export const landingHeroTaglineClasses =
  "text-sm font-medium uppercase tracking-[0.22em] sm:text-base";

export const avatarSizeTextClasses = {
  xs: "text-xs sm:text-sm",
  sm: "text-xs sm:text-sm lg:text-base",
  md: "text-sm sm:text-base lg:text-lg",
  lg: "text-base sm:text-lg lg:text-xl",
  xl: "text-lg sm:text-xl lg:text-2xl",
} as const;

export const authBadgeClasses = "text-xs font-semibold sm:text-sm";

export const authFormTextClasses = bodyTextClasses;

export const authFormOverlineClasses =
  "text-xs font-medium uppercase tracking-wide text-muted sm:text-sm";

export const themeToggleLabelClasses = bodyTextClasses;

export const footerLinkTextClasses = bodyTextClasses;

export const footerMutedTextClasses = bodySmallTextClasses;

export const appStoreBadgeSmallClasses = "text-[0.6rem]";

export const appStoreBadgeLabelClasses =
  "text-[11px] font-semibold sm:text-xs";

export const displayBodyClasses = bodyLargeTextClasses;

export const passwordStrengthTextClasses = bodySmallTextClasses;

export const otpDigitTextClasses = "text-lg font-semibold sm:text-xl";
