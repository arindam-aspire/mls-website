"use client";

import { cn } from "@/src/lib/cn";
import { bodyTextClasses, headingAuthClasses } from "@/src/lib/typography";

type ProfileEditContactModalTitleProps = {
  title: string;
  description?: string;
  className?: string;
};

export function ProfileEditContactModalTitle({
  title,
  description,
  className,
}: ProfileEditContactModalTitleProps) {
  return (
    <div className={cn("space-y-2 pb-4 text-center", className)}>
      <h3 className={headingAuthClasses}>{title}</h3>
      {description != null && description !== "" ? (
        <p className={cn(bodyTextClasses, "text-muted")}>{description}</p>
      ) : null}
    </div>
  );
}
