import Image from "next/image";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { cn } from "@/src/lib/cn";

export type LoadingUiProps = {
  brand?: string;
  loadingLabel?: string;
};

export function LoadingUi({ brand, loadingLabel }: LoadingUiProps) {
  const showText = Boolean(brand && loadingLabel);

  return (
    <div
      className="fixed inset-0 z-50 flex min-h-screen flex-col bg-page"
      role="status"
      aria-busy="true"
      aria-label={loadingLabel}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-primary-light/40 via-page to-page dark:from-primary-light/20"
        aria-hidden
      />

      <div className="relative flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-16 text-center sm:gap-10">
        <Image
          src={mlsLogoLight}
          alt=""
          aria-hidden
          className="h-24 w-auto animate-logo-breathe sm:h-28 dark:hidden"
          priority
        />
        <Image
          src={mlsLogoDark}
          alt=""
          aria-hidden
          className="hidden h-24 w-auto animate-logo-breathe sm:h-28 dark:block"
          priority
        />

        <div className="flex max-w-lg flex-col items-center gap-3">
          {showText ? (
            <>
              <h1 className="font-serif text-3xl leading-tight text-text sm:text-4xl">
                {brand}
              </h1>
              <p className="text-xs font-medium tracking-[0.32em] text-muted uppercase sm:text-sm">
                {loadingLabel}
              </p>
            </>
          ) : (
            <div className="flex w-full flex-col items-center gap-3" aria-hidden>
              <div
                className={cn(
                  "h-9 w-48 max-w-full animate-skeleton-pulse rounded-lg",
                  "bg-primary-light/80 dark:bg-secondary-light/35 sm:h-10 sm:w-56",
                )}
              />
              <div
                className={cn(
                  "h-4 w-32 animate-skeleton-pulse rounded-lg",
                  "bg-primary-light/80 dark:bg-secondary-light/35",
                )}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2" aria-hidden>
          <span className="size-2 rounded-full bg-primary animate-loading-dot" />
          <span className="size-2 rounded-full bg-primary animate-loading-dot [animation-delay:0.2s]" />
          <span className="size-2 rounded-full bg-primary animate-loading-dot [animation-delay:0.4s]" />
        </div>
      </div>

      <div className="relative h-1 w-full overflow-hidden bg-primary-light" aria-hidden>
        <div className="h-full w-1/3 bg-primary animate-loading-bar" />
      </div>
    </div>
  );
}
