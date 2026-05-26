import { Clock, Hammer } from "lucide-react";
import { cn } from "@/src/lib/cn";
import type { ReactNode } from "react";

export interface ComingSoonCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  icon?: ReactNode;
  className?: string;
}

export function ComingSoonCard({
  title = "Coming Soon",
  subtitle = "Under Development",
  description = "We're working hard to bring this feature to you. Stay tuned for updates!",
  icon,
  className,
}: ComingSoonCardProps) {
  return (
    <section
      className={cn(
        "w-full bg-surface px-4 py-20 sm:px-6 sm:py-28 lg:py-32",
        className,
      )}
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="inline-flex size-16 items-center justify-center rounded-full border border-dashed border-secondary/30 bg-primary-light text-primary sm:size-20">
          {icon ?? <Hammer className="size-7 sm:size-9" aria-hidden />}
        </span>

        <p className="mt-6 text-xs font-bold tracking-[0.2em] text-secondary-dark uppercase sm:text-sm">
          {subtitle}
        </p>
        <span
          className="mt-3 block h-0.5 w-14 bg-secondary-dark"
          aria-hidden
        />

        <h2 className="mt-8 font-serif text-3xl leading-tight text-text sm:mt-10 sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:mt-8 sm:text-lg">
          {description}
        </p>

        <div className="mt-8 flex items-center gap-2 text-muted sm:mt-10">
          <Clock className="size-4" aria-hidden />
          <span className="text-xs tracking-wide sm:text-sm">
            Check back soon
          </span>
        </div>
      </div>
    </section>
  );
}
