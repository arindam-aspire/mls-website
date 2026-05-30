import { cn } from "@/src/lib/cn";
import {
  displayEyebrowClasses,
  landingSectionBodyClasses,
  landingSectionTitleClasses,
} from "@/src/lib/typography";

export function DetailsSection({ t }: { t: any }) {
  return (
    <section className="bg-surface px-6 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className={displayEyebrowClasses}>
          {t("whyMls")}
        </p>
        <span
          className="mt-3 block h-0.5 w-14 bg-secondary-dark"
          aria-hidden
        />

        <h2 className={cn("mt-8 sm:mt-10", landingSectionTitleClasses)}>
          {t("trustedPlatformTitle")}
        </h2>

        <p className={cn("mt-6 text-muted sm:mt-8", landingSectionBodyClasses)}>
          {t("trustedPlatformDescription")}
        </p>
      </div>
    </section>
  );
}
