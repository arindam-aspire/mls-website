"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import {
  notFoundBodyClasses,
  notFoundCodeClasses,
  notFoundTitleClasses,
} from "@/src/lib/typography";

export function NotFoundScreen() {
  const t = useTranslations("notFound");
  const router = useRouter();

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
      <p className={notFoundCodeClasses}>
        {t("code")}
      </p>
      <span
        className="mt-3 block h-0.5 w-14 bg-secondary"
        aria-hidden
      />

      <h1 className={cn("mt-8", notFoundTitleClasses)}>
        {t("title")}
      </h1>

      <p className={cn("mt-6 max-w-md text-muted", notFoundBodyClasses)}>
        {t("description")}
      </p>

      <Button
        type="button"
        color="primary"
        variant="solid"
        size="md"
        className="mt-10"
        onClick={() => router.push("/")}
      >
        {t("backHome")}
      </Button>
    </section>
  );
}
