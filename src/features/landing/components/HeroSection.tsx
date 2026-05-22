import { getTranslations } from "next-intl/server";
import heroImage from "@/src/assets/images/MLS_Home_Image.png";
import { HeroSearchBar } from "./HeroSearchBar";

export async function HeroSection() {
  const t = await getTranslations("home");

  return (
    <section
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat py-24 sm:py-28 lg:py-32"
      style={{ backgroundImage: `url(${heroImage.src})` }}
      aria-label={t("heroImageAlt")}
    >
      <div
        className="absolute inset-0 bg-black/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-2 px-4 text-center sm:gap-3 sm:px-6">
        <p className="text-xs font-medium tracking-[0.28em] text-tertiary uppercase sm:text-sm">
          {t("heroEyebrow")}
        </p>

        <div className="flex flex-col gap-0">
          <h1 className="font-serif text-4xl leading-tight text-hero-on-image sm:text-5xl lg:text-6xl">
            {t("heroTitleLine1")}
          </h1>

          <p className="font-serif text-4xl leading-tight text-tertiary italic sm:text-5xl lg:text-6xl">
            {t("heroTitleLine2")}
          </p>
        </div>

        <p className="text-sm font-medium tracking-[0.22em] text-hero-on-image uppercase sm:text-base">
          {t("heroTagline")}
        </p>

        <div className="w-full min-w-0">
          <HeroSearchBar />
        </div>
      </div>
    </section>
  );
}
