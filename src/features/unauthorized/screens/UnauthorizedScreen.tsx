"use client";

import { Home, ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import {
  comingSoonBodyClasses,
  comingSoonTitleClasses,
  displayEyebrowClasses,
} from "@/src/lib/typography";

export function UnauthorizedScreen() {
  const t = useTranslations("unauthorized");
  const router = useRouter();

  return (
    <section
      className="w-full bg-surface px-4 py-20 sm:px-6 sm:py-28 lg:py-32"
      aria-labelledby="unauthorized-title"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full border border-dashed border-tertiary-dark/30 bg-tertiary-light/50 text-tertiary-dark sm:size-20">
          <ShieldAlert className="size-7 sm:size-9" aria-hidden />
        </span>

        <p className={cn("mt-6", displayEyebrowClasses, "text-secondary")}>
          {t("eyebrow")}
        </p>
        <span
          className="mt-3 block h-0.5 w-14 bg-secondary-dark"
          aria-hidden
        />

        <h1
          id="unauthorized-title"
          className={cn("mt-8 sm:mt-10", comingSoonTitleClasses)}
        >
          {t("title")}
        </h1>

        <p
          className={cn(
            "mt-6 max-w-md text-muted sm:mt-8",
            comingSoonBodyClasses,
          )}
        >
          {t("description")}
        </p>

        <Button
          type="button"
          color="primary"
          variant="solid"
          size="md"
          iconStart={<Home aria-hidden />}
          className="mt-8 shrink-0 sm:mt-10"
          onClick={() => router.push("/")}
        >
          {t("backHome")}
        </Button>
      </div>
    </section>
  );
}
