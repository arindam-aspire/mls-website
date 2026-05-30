"use client";

import {
  Link,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalPanel,
} from "@/src/components/ui";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  AUTH_OTP_EMAIL_QUERY_KEY,
  AUTH_OTP_FLOW_QUERY_KEY,
  AUTH_OTP_PHONE_COUNTRY_QUERY_KEY,
  AUTH_OTP_PHONE_QUERY_KEY,
  AUTH_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  isAgencyAuthView,
  isAuthView,
  resolveAuthSignUpView,
  type AuthOtpFlow,
  type AuthView,
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { OTPVerificationForm } from "../components/OTPVerificationForm";
import { useForgotPassword, useSignInWithOtpVerify } from "../mutations/auth.mutation";
import { useAuthStore } from "../store/auth.store";
import { maskEmail, maskPhone } from "../maskContact";
import { cn } from "@/src/lib/cn";
import {
  headingAuthClasses,
  bodyTextClasses,
  bodyLargeTextClasses,
  captionTextClasses,
} from "@/src/lib/typography";

function resolveReturnView(from: string | null): AuthView {
  if (isAuthView(from)) {
    return from;
  }
  return AUTH_VIEW.userSignIn;
}

function resolveOtpFlow(value: string | null): AuthOtpFlow {
  return value === "forgot" ? "forgot" : "signin";
}

function resolveOtpBackView(
  otpFlow: AuthOtpFlow,
  returnView: AuthView,
): AuthView {
  if (otpFlow === "forgot") {
    return AUTH_VIEW.forgotPassword;
  }
  if (isAgencyAuthView(returnView)) {
    return AUTH_VIEW.agencySignIn;
  }
  return AUTH_VIEW.signInOtp;
}

function OtpTitle({
  contactEmail,
  contactPhone,
  contactPhoneCountry = "JO",
}: {
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
}) {
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
    <div className="space-y-2 text-center">
      <h2 className={headingAuthClasses}>
        {t("otpVerifyTitle")}
      </h2>
      <p className={cn(bodyTextClasses, "text-muted")}>{subtitle}</p>
      {contactLine !== "" && (
        <p className={cn(bodyTextClasses, "font-semibold text-text")}>{contactLine}</p>
      )}
    </div>
  );
}

export function OTPVerificationScreen() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const returnView = resolveReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
  );
  const otpFlow = resolveOtpFlow(searchParams.get(AUTH_OTP_FLOW_QUERY_KEY));
  const contactEmail = searchParams.get(AUTH_OTP_EMAIL_QUERY_KEY) ?? undefined;
  const contactPhone = searchParams.get(AUTH_OTP_PHONE_QUERY_KEY) ?? undefined;
  const contactPhoneCountry =
    searchParams.get(AUTH_OTP_PHONE_COUNTRY_QUERY_KEY) ?? undefined;
  const signUpView = resolveAuthSignUpView(returnView);
  const isAgency = isAgencyAuthView(returnView);

  const { mutate: resendOtp, isPending: isResending } = useForgotPassword();
  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    isSuccess: isOtpVerifySuccess,
  } = useSignInWithOtpVerify();
  const { setForgotPasswordOtp } = useAuthStore();

  const openAuthView = (view: AuthView) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  const handleBack = () => {
    openAuthView(resolveOtpBackView(otpFlow, returnView));
  };

  const handleResend = () => {
    resendOtp({
      email: contactEmail,
      phoneCountryCode: contactPhoneCountry,
      phoneNationalNumber: contactPhone,
    });
  };

  const handleSubmit = (code: string) => {
    if (otpFlow === "forgot") {
      setForgotPasswordOtp(code);
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.resetPassword, {
          returnView,
          otpFlow,
          contactEmail,
          contactPhone,
          contactPhoneCountry,
        }),
      );
      return;
    }

    verifyOtp({
      otp: code,
      email: contactEmail,
      phone_number: contactPhone,
    });
  };

  useEffect(() => {
    if (isOtpVerifySuccess) {
      const nextView = isAgency
        ? AUTH_VIEW.agencyEmailSignIn
        : AUTH_VIEW.userSignIn;
      openAuthView(nextView);
    }
  }, [isOtpVerifySuccess]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack onBack={handleBack} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="flex flex-col gap-6 px-4 pb-4 sm:px-6 sm:pb-6">
          <OtpTitle
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            contactPhoneCountry={contactPhoneCountry}
          />
          <OTPVerificationForm
            otpFlow={otpFlow}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            contactPhoneCountry={contactPhoneCountry}
            onSubmit={handleSubmit}
            onResend={handleResend}
            isLoading={isVerifying}
            isResending={isResending}
          />
        </div>
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div className="space-y-2">
          <p className={cn(bodyLargeTextClasses, "text-center text-muted")}>
            {isAgency ? t("agencySignInNoAccount") : t("chooseAccountNoAccount")}
          </p>
          <div className="flex justify-center">
            <Link
              color="primary"
              size="lg"
              className="text-center font-semibold"
              onClick={() => openAuthView(signUpView)}
            >
              {isAgency
                ? t("agencyCreateAccount")
                : t("chooseAccountCreateAccount")}
            </Link>
          </div>
          <div className={cn("flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-1 text-muted", captionTextClasses)}>
            <Link
              color="muted"
              variant="subtle"
              size="sm"
              className="font-normal"
              alwaysUnderline={false}
            >
              {t("termsOfService")}
            </Link>
            <span className="text-muted/60" aria-hidden>
              •
            </span>
            <Link
              color="muted"
              variant="subtle"
              size="sm"
              className="font-normal"
              alwaysUnderline={false}
            >
              {tCommon("privacyPolicy")}
            </Link>
          </div>
        </div>
      </ModalFooter>
    </ModalPanel>
  );
}
