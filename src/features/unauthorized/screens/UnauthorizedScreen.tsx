"use client";

import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import {
  notFoundBodyClasses,
  notFoundCodeClasses,
  notFoundTitleClasses,
} from "@/src/lib/typography";

export function UnauthorizedScreen() {
  const t = useTranslations("common");
  const router = useRouter();

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 sm:py-20">
      <div className="w-full max-w-xl rounded-xl border border-secondary/15 bg-surface p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto inline-flex size-14 items-center justify-center rounded-xl bg-danger/15 text-danger">
          <ShieldAlert className="size-7" aria-hidden />
        </div>

        <p className={cn("mt-5", notFoundCodeClasses)}>401</p>
        <span className="mt-3 block h-0.5 w-14 bg-secondary mx-auto" aria-hidden />

        <h1 className={cn("mt-7", notFoundTitleClasses)}>Unauthorized</h1>
        <p className={cn("mx-auto mt-4 max-w-md text-muted", notFoundBodyClasses)}>
          You do not have permission to access this page.
        </p>

        <Button
          type="button"
          color="primary"
          variant="solid"
          size="md"
          className="mt-8"
          onClick={() => router.push("/")}
        >
          {t("backHome")}
        </Button>
      </div>
    </section>
  );
}
