export function DetailsSection({ t }: { t: any }) {
  return (
    <section className="bg-surface px-6 py-24 sm:py-28 lg:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-secondary-dark uppercase">
          {t("whyMls")}
        </p>
        <span
          className="mt-3 block h-0.5 w-14 bg-secondary-dark"
          aria-hidden
        />

        <h2 className="mt-8 font-serif text-3xl leading-tight text-text sm:mt-10 sm:text-4xl lg:text-5xl">
          {t("trustedPlatformTitle")}
        </h2>

        <p className="mt-6 text-base leading-relaxed text-muted sm:mt-8 sm:text-lg">
          {t("trustedPlatformDescription")}
        </p>
      </div>
    </section>
  );
}
