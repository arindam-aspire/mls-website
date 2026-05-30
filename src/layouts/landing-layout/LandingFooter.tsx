import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import mlsLogo from "@/src/assets/images/MLS_Dark_Logo.png";
import {
  appStoreBadgeLabelClasses,
  appStoreBadgeSmallClasses,
  footerLinkTextClasses,
  footerMutedTextClasses,
} from "@/src/lib/typography";

function AppStoreBadge() {
  return (
    <a
      href="#"
      className="inline-flex min-h-11 min-w-[8.5rem] items-center gap-2 rounded-lg border border-white bg-black px-3 py-2 text-white transition-opacity hover:opacity-90"
      aria-label="Download on the App Store"
    >
      <svg
        className="size-6 shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className={appStoreBadgeSmallClasses}>Download on the</span>
        <span className={appStoreBadgeLabelClasses}>App Store</span>
      </span>
    </a>
  );
}

function GooglePlayBadge() {
  return (
    <a
      href="#"
      className="inline-flex min-h-11 min-w-[8.5rem] items-center gap-2 rounded-lg border border-white bg-black px-3 py-2 text-white transition-opacity hover:opacity-90"
      aria-label="Get it on Google Play"
    >
      <svg className="size-6 shrink-0" viewBox="0 0 24 24" aria-hidden>
        <path fill="#00D2FF" d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z" />
        <path fill="#00F076" d="M16.81 15.12L6.05 21.34L14.56 12.83L16.81 15.12Z" />
        <path fill="#FF3A44" d="M3.84 2.15C4.34 1.9 4.95 1.95 5.45 2.3L20.66 11.07C21.16 11.37 21.16 12.63 20.66 12.93L5.45 21.7C4.95 22.05 4.34 22.1 3.84 21.85L14.56 12.83L3.84 2.15Z" />
        <path fill="#FFB300" d="M16.81 8.88L6.05 2.66L14.56 11.17L16.81 8.88Z" />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className={`${appStoreBadgeSmallClasses} uppercase`}>Get it on</span>
        <span className={appStoreBadgeLabelClasses}>Google Play</span>
      </span>
    </a>
  );
}

export async function LandingFooter() {
  const t = await getTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-4 border-primary bg-inherit-color text-white">
      <div className="w-full px-6">
        <div className="flex flex-col gap-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="inline-flex shrink-0">
            <Image
              src={mlsLogo}
              alt={t("brand")}
              width={180}
              height={60}
              className="h-12 w-auto sm:h-14"
            />
          </Link>

          <div className="flex flex-col gap-3 sm:items-end">
            <p className={`${footerLinkTextClasses} text-white/90`}>{t("downloadOurApp")}</p>
            <div className="flex flex-wrap gap-3">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>
        </div>

        <div className="border-t border-white/20" />

        <div className={`flex flex-col gap-3 py-4 text-white/75 sm:flex-row sm:items-center sm:justify-between ${footerMutedTextClasses}`}>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="#" className="transition-colors hover:text-white">
              {t("termsAndConditions")}
            </Link>
            <span aria-hidden className="text-white/40">
              |
            </span>
            <Link href="#" className="transition-colors hover:text-white">
              {t("privacyPolicy")}
            </Link>
          </div>
          <p className="sm:text-end">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
