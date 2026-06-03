"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import type {
  OtpVerificationFormLabels,
  OtpVerificationTitleLabels,
} from "./types";

type OtpTranslationNamespace = "auth" | "profile";

export function useOtpVerificationFormLabels(
  namespace: OtpTranslationNamespace,
): OtpVerificationFormLabels {
  const t = useTranslations(namespace);

  return useMemo(
    () => ({
      codeLabel: t("otpVerifyCodeLabel"),
      digitLabel: ({ index }) => t("otpVerifyDigitLabel", { index }),
      codeRequired: t("otpVerifyCodeRequired"),
      didntReceive: t("otpVerifyDidntReceive"),
      resend: t("otpVerifyResend"),
      resendIn: ({ time }) => t("otpVerifyResendIn", { time }),
      continue: t("otpVerifyContinue"),
      confirmLoading: t("otpVerifyConfirmLoading"),
    }),
    [t],
  );
}

export function useOtpVerificationTitleLabels(
  namespace: OtpTranslationNamespace,
  subtitleKey:
    | "otpVerifySubtitle"
    | "otpVerifySubtitleEmail"
    | "otpVerifySubtitlePhone"
    | "otpVerifySubtitleBoth",
): OtpVerificationTitleLabels {
  const t = useTranslations(namespace);

  return useMemo(
    () => ({
      title: t("otpVerifyTitle"),
      subtitle: t(subtitleKey),
      sentCodeLabel: t("otpVerifySentCodeLabel"),
    }),
    [subtitleKey, t],
  );
}
