import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import {
  footerLinkTextClasses,
  footerMutedTextClasses,
} from "@/src/lib/typography";

export async function ProtectedFooter() {
  const t = await getTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t-4 border-primary bg-inherit-color text-white max-md:pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))]">
      <div className="container mx-auto w-full px-4 py-4 sm:px-6">
        <div
          className={`flex flex-col gap-3 text-white/85 sm:flex-row sm:items-center sm:justify-between ${footerMutedTextClasses}`}
        >
          <div className={`flex flex-wrap items-center gap-2 ${footerLinkTextClasses}`}>
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
