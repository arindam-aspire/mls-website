import { cn } from "@/src/lib/cn";
import type { SkeletonProps, SkeletonTextProps, SkeletonVariant } from "./types";

const variantClasses: Record<SkeletonVariant, string> = {
  block: "rounded-xl",
  text: "h-4 w-full rounded-lg",
  circular: "rounded-full",
};

export function Skeleton({
  variant = "block",
  className,
  ...rest
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative overflow-hidden bg-primary-light/80 dark:bg-secondary-light/35",
        "animate-skeleton-pulse",
        variantClasses[variant],
        className,
      )}
      {...rest}
    />
  );
}

export function SkeletonText({
  lines = 3,
  lineClassName,
  className,
  ...rest
}: SkeletonTextProps) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2", className)}
      aria-hidden
      {...rest}
    >
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn(
            index === lines - 1 && lines > 1 && "w-4/5",
            lineClassName,
          )}
        />
      ))}
    </div>
  );
}

export type { SkeletonProps, SkeletonTextProps, SkeletonVariant } from "./types";
export { SKELETON_VARIANTS } from "./types";
