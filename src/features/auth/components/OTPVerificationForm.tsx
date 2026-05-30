"use client";

import { Clock, ShieldCheck } from "lucide-react";
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
import { cn } from "@/src/lib/cn";
import { bodyTextClasses, otpDigitTextClasses } from "@/src/lib/typography";
import type { AuthOtpFlow } from "../authViews";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

type OTPVerificationFormProps = {
  otpFlow: AuthOtpFlow;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  onSubmit: (code: string) => void;
  onResend: () => void;
  isLoading: boolean;
  isResending: boolean;
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
  onSubmit,
  onResend,
  isLoading,
  isResending,
}: OTPVerificationFormProps) {
  const t = useTranslations("auth");
  const legendId = useId();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);

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
    if (resendSeconds > 0 || isResending) {
      return;
    }

    onResend();
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

    onSubmit(code);
  };

  const getDigitClassName = (index: number) => {
    const hasValue = digits[index] !== "";
    const isFocused = focusedIndex === index;

    return cn(
      cn(
        "size-12 rounded-lg border text-center tabular-nums transition-colors outline-none sm:size-14",
        otpDigitTextClasses,
      ),
      hasValue &&
        "border-primary bg-primary-light text-primary-dark",
      !hasValue &&
        !isFocused &&
        "border-secondary-light bg-surface text-text",
      isFocused &&
        "border-primary bg-surface text-text ring-2 ring-primary/25",
    );
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6">
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
          <p role="alert" className={cn("text-center text-danger", bodyTextClasses)}>
            {error}
          </p>
        )}
      </div>

      <div className="space-y-2 text-center">
        <p className={cn(bodyTextClasses, "text-text")}>
          {t("otpVerifyDidntReceive")}{" "}
          <Link
            type="button"
            color="primary"
            size="sm"
            className={cn(
              "font-semibold",
              (resendSeconds > 0 || isResending) && "pointer-events-none opacity-50",
            )}
            onClick={handleResend}
            disabled={resendSeconds > 0 || isResending}
          >
            {t("otpVerifyResend")}
          </Link>
        </p>
        {resendSeconds > 0 && (
          <p className={cn("inline-flex items-center justify-center gap-1.5 text-muted", bodyTextClasses)}>
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
        isLoading={isLoading}
        iconStart={<ShieldCheck className="size-5" aria-hidden />}
      >
        {t("otpVerifyContinue")}
      </Button>
    </form>
  );
}
