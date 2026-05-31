"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import { bodyTextClasses, headingAuthClasses } from "@/src/lib/typography";
import { maskEmail, maskPhone } from "../maskContact";

type OtpVerificationTitleProps = {
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  displayOtp?: string;
};

export function OtpVerificationTitle({
  contactEmail,
  contactPhone,
  contactPhoneCountry = "JO",
  displayOtp,
}: OtpVerificationTitleProps) {
  const t = useTranslations("auth");
  const maskedEmail = contactEmail?.trim() ? maskEmail(contactEmail) : null;
  const maskedPhone = contactPhone?.trim()
    ? maskPhone(contactPhone, contactPhoneCountry)
    : null;
  const hasEmail = maskedEmail != null;
  const hasPhone = maskedPhone != null;

  const subtitle =
    hasEmail && hasPhone
      ? t("otpVerifySubtitleBoth")
      : hasEmail
        ? t("otpVerifySubtitleEmail")
        : hasPhone
          ? t("otpVerifySubtitlePhone")
          : t("otpVerifySubtitle");

  const contactLine = [maskedEmail, maskedPhone].filter(Boolean).join(" | ");

  return (
    <div className="space-y-2 px-4 !pb-4 text-center sm:px-6">
      <h2 className={headingAuthClasses}>{t("otpVerifyTitle")}</h2>
      <p className={cn(bodyTextClasses, "text-muted")}>{subtitle}</p>
      {contactLine !== "" && (
        <p className={cn(bodyTextClasses, "font-semibold text-text")}>{contactLine}</p>
      )}
      {displayOtp != null && displayOtp !== "" && (
        <div className="pt-2">
          <p className={cn(bodyTextClasses, "text-muted")}>{t("otpVerifySentCodeLabel")}</p>
          <p className="mt-1 font-bold tracking-[0.35em] text-primary tabular-nums text-xl sm:text-2xl">
            {displayOtp}
          </p>
        </div>
      )}
    </div>
  );
}
