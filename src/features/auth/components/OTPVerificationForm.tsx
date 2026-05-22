"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button, Link } from "@/src/components/ui";
import { cn } from "@/lib/cn";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AuthOtpFlow, AuthView } from "../authViews";
import {
  AUTH_VIEW,
  buildAuthModalUrl,
  isAgencyAuthView,
} from "../authViews";
import { maskEmail, maskPhone } from "../maskContact";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 45;

type OTPVerificationFormProps = {
  otpFlow: AuthOtpFlow;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  returnView?: AuthView;
};

function formatResendTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

export function OTPVerificationForm({
  otpFlow,
  contactEmail,
  contactPhone,
  contactPhoneCountry = "JO",
  returnView,
}: OTPVerificationFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const legendId = useId();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);

  const maskedEmail =
    contactEmail != null && contactEmail.trim() !== ""
      ? maskEmail(contactEmail)
      : null;
  const maskedPhone =
    contactPhone != null && contactPhone.trim() !== ""
      ? maskPhone(contactPhone, contactPhoneCountry)
      : null;

  const hasEmail = maskedEmail != null;
  const hasPhone = maskedPhone != null;

  const code = digits.join("");
  const isComplete = code.length === OTP_LENGTH && digits.every((d) => d !== "");

  useEffect(() => {
    if (resendSeconds <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendSeconds((prev) => prev - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const focusInput = (index: number) => {
    const clamped = Math.max(0, Math.min(index, OTP_LENGTH - 1));
    setFocusedIndex(clamped);
    inputRefs.current[clamped]?.focus();
  };

  const updateDigits = (nextDigits: string[]) => {
    setDigits(nextDigits);
    if (error) {
      setError(undefined);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    updateDigits(nextDigits);

    if (digit && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) {
      return;
    }

    const nextDigits = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i += 1) {
      nextDigits[i] = pasted.charAt(i);
    }
    updateDigits(nextDigits);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const handleResend = () => {
    if (resendSeconds > 0) {
      return;
    }

    setResendSeconds(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    setError(undefined);
    focusInput(0);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isComplete) {
      setError(t("otpVerifyCodeRequired"));
      return;
    }

    const nextView =
      otpFlow === "forgot"
        ? AUTH_VIEW.resetPassword
        : returnView != null && isAgencyAuthView(returnView)
          ? AUTH_VIEW.agencyEmailSignIn
          : AUTH_VIEW.userSignIn;

    router.replace(
      buildAuthModalUrl(pathname, nextView, {
        returnView,
        otpFlow,
        contactEmail,
        contactPhone,
        contactPhoneCountry,
      }),
    );
  };

  const getDigitClassName = (index: number) => {
    const hasValue = digits[index] !== "";
    const isFocused = focusedIndex === index;

    return cn(
      "size-12 rounded-lg border text-center text-lg font-semibold tabular-nums transition-colors outline-none sm:size-14 sm:text-xl",
      hasValue &&
        "border-primary bg-primary-light text-primary-dark",
      !hasValue &&
        !isFocused &&
        "border-secondary-light bg-surface text-text",
      isFocused &&
        "border-primary bg-surface text-text ring-2 ring-primary/25",
    );
  };

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
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold text-secondary sm:text-2xl">
          {t("otpVerifyTitle")}
        </h2>
        <p className="text-sm text-muted">{subtitle}</p>
        {contactLine !== "" && (
          <p className="text-sm font-semibold text-text">{contactLine}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div
          role="group"
          aria-labelledby={legendId}
          className="flex justify-center gap-2 sm:gap-3"
        >
          <span id={legendId} className="sr-only">
            {t("otpVerifyCodeLabel")}
          </span>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={index === 0 ? "one-time-code" : "off"}
              maxLength={1}
              value={digit}
              aria-label={t("otpVerifyDigitLabel", { index: index + 1 })}
              aria-invalid={error != null || undefined}
              className={getDigitClassName(index)}
              onChange={(event) => handleDigitChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onFocus={() => setFocusedIndex(index)}
              onPaste={handlePaste}
            />
          ))}
        </div>
        {error != null && (
          <p role="alert" className="text-center text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-2 text-center">
        <p className="text-sm text-text">
          {t("otpVerifyDidntReceive")}{" "}
          <Link
            type="button"
            color="primary"
            size="sm"
            className={cn(
              "font-semibold",
              resendSeconds > 0 && "pointer-events-none opacity-50",
            )}
            onClick={handleResend}
            disabled={resendSeconds > 0}
          >
            {t("otpVerifyResend")}
          </Link>
        </p>
        {resendSeconds > 0 && (
          <p className="inline-flex items-center justify-center gap-1.5 text-sm text-muted">
            <Clock className="size-4 shrink-0" aria-hidden />
            {t("otpVerifyResendIn", { time: formatResendTimer(resendSeconds) })}
          </p>
        )}
      </div>

      <Button
        type="submit"
        color="primary"
        size="lg"
        fullWidth
        className="font-semibold"
        disabled={!isComplete}
      >
        {t("otpVerifyContinue")}
      </Button>
    </form>
  );
}
