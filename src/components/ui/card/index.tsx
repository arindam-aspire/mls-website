import { cn } from "@/src/lib/cn";
import {
  cardDescriptionClasses,
  cardTitleClasses,
} from "@/src/lib/typography";
import type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from "./types";

export function Card({ className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-none bg-surface text-text shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...rest }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 px-4 pt-4 pb-0 md:px-6 md:pt-6 md:pb-0",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...rest }: CardTitleProps) {
  return (
    <h3
      className={cn(cardTitleClasses, "leading-none tracking-tight", className)}
      {...rest}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...rest
}: CardDescriptionProps) {
  return (
    <p className={cn(cardDescriptionClasses, "text-muted", className)} {...rest}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...rest }: CardContentProps) {
  return (
    <div className={cn("p-4 md:p-6", className)} {...rest}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...rest }: CardFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center border-t border-secondary/30 px-4 py-4 md:px-6 md:py-4",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export type {
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
} from "./types";

