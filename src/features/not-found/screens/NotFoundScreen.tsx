"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "@/src/i18n/navigation";

export function NotFoundScreen() {
  const t = useTranslations("notFound");
  const router = useRouter();

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
      <p className="text-4xl font-bold leading-none text-secondary sm:text-5xl">
        {t("code")}
      </p>
      <span
        className="mt-3 block h-0.5 w-14 bg-secondary"
        aria-hidden
      />

      <h1 className="mt-8 font-serif text-3xl leading-tight text-text sm:text-4xl lg:text-5xl">
        {t("title")}
      </h1>

      <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
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
