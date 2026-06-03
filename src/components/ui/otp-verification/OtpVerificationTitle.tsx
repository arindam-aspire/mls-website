"use client";

import { cn } from "@/src/lib/cn";
import { bodyTextClasses, headingAuthClasses } from "@/src/lib/typography";
import type { OtpVerificationTitleProps } from "./types";

export function OtpVerificationTitle({
  labels,
  contactLine,
  displayOtp,
  className,
}: OtpVerificationTitleProps) {
  const trimmedContact = contactLine?.trim() ?? "";

  return (
    <div className={cn("space-y-2 pb-4 text-center", className)}>
      <h3 className={headingAuthClasses}>{labels.title}</h3>
      <p className={cn(bodyTextClasses, "text-muted")}>{labels.subtitle}</p>
      {trimmedContact !== "" ? (
        <p className={cn(bodyTextClasses, "font-semibold text-text")}>{trimmedContact}</p>
      ) : null}
      {displayOtp != null && displayOtp !== "" ? (
        <div className="pt-2">
          <p className={cn(bodyTextClasses, "text-muted")}>{labels.sentCodeLabel}</p>
          <p className="mt-1 text-xl font-bold tracking-[0.35em] text-primary tabular-nums sm:text-2xl">
            {displayOtp}
          </p>
        </div>
      ) : null}
    </div>
  );
}
