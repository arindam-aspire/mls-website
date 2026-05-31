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
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  isAgencyAuthView,
  isAuthView,
  resolveAuthSignUpView,
  resolveSignInOtpSession,
  resolveSignInRoleFromAuthContext,
  type AuthOtpFlow,
  type AuthView,
} from "@/src/features/auth/authViews";
import { useAuthPortal, useIsAgentSignInPortal } from "../hooks/useAuthPortal";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { OTPVerificationForm } from "../components/OTPVerificationForm";
import { useForgotPassword, useSignInWithOtpRequest, useSignInWithOtpVerify } from "../mutations/auth.mutation";
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
  displayOtp,
}: {
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  displayOtp?: string;
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
    <div className="space-y-2 px-4 !pb-4 text-center sm:px-6">
      <h2 className={headingAuthClasses}>
        {t("otpVerifyTitle")}
      </h2>
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

type OTPVerificationScreenProps = {
  onSighinSuccess: () => void;
};

export function OTPVerificationScreen({
  onSighinSuccess,
}: OTPVerificationScreenProps) {
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
  const portal = useAuthPortal();
  const isAgent = useIsAgentSignInPortal();
  const showCreateAccount = isAgency && !isAgent;
  const signInRole = resolveSignInRoleFromAuthContext(returnView, portal);
  const { setForgotPasswordOtp, pendingOtpSession } = useAuthStore();
  const signInOtpSession = resolveSignInOtpSession(
    searchParams,
    pendingOtpSession,
  );

  const { mutate: resendOtp, isPending: isResending } = useForgotPassword();
  const { mutate: resendSignInOtp, isPending: isResendingSignInOtp } =
    useSignInWithOtpRequest();
  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    isSuccess: isOtpVerifySuccess,
  } = useSignInWithOtpVerify();
  const isResendingOtp = otpFlow === "forgot" ? isResending : isResendingSignInOtp;

  const buildSignInOtpVerifyUrl = (otpSession: string, otpCode: string) =>
    buildAuthModalUrl(pathname, AUTH_VIEW.otpVerify, {
      otpFlow: "signin",
      returnView,
      contactEmail,
      portal: portal ?? undefined,
      otpSession,
      otpCode,
    });

  const openAuthView = (view: AuthView) => {
    router.replace(
      buildAuthModalUrl(pathname, view, portal ? { portal } : undefined),
    );
  };

  const handleBack = () => {
    openAuthView(resolveOtpBackView(otpFlow, returnView));
  };

  const handleResend = () => {
    if (otpFlow === "forgot") {
      resendOtp({
        email: contactEmail,
        phoneCountryCode: contactPhoneCountry,
        phoneNationalNumber: contactPhone,
      });
      return;
    }

    if (contactEmail?.trim()) {
      resendSignInOtp(
        {
          username: contactEmail.trim(),
          role: signInRole,
        },
        {
          onSuccess: (response) => {
            router.replace(
              buildSignInOtpVerifyUrl(
                response.data.session,
                response.data.otp,
              ),
            );
          },
        },
      );
    }
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
          portal: portal ?? undefined,
        }),
      );
      return;
    }

    if (signInOtpSession?.session == null || !contactEmail?.trim()) {
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.signInOtp, {
          returnView,
          portal: portal ?? undefined,
        }),
      );
      return;
    }

    verifyOtp({
      username: contactEmail.trim(),
      code,
      session: signInOtpSession.session,
      role: signInRole,
    });
  };

  useEffect(() => {
    if (isOtpVerifySuccess && otpFlow === "signin") {
      onSighinSuccess();
    }
  }, [isOtpVerifySuccess, otpFlow, onSighinSuccess]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack onBack={handleBack} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <OtpTitle
          contactEmail={contactEmail}
          contactPhone={contactPhone}
          contactPhoneCountry={contactPhoneCountry}
          displayOtp={
            otpFlow === "signin" ? signInOtpSession?.otp : undefined
          }
        />
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <OTPVerificationForm
            otpFlow={otpFlow}
            contactEmail={contactEmail}
            contactPhone={contactPhone}
            contactPhoneCountry={contactPhoneCountry}
            onSubmit={handleSubmit}
            onResend={handleResend}
            isLoading={isVerifying}
            isResending={isResendingOtp}
          />
        </div>
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div className="space-y-2">
          {showCreateAccount && (
            <>
              <p className={cn(bodyLargeTextClasses, "text-center text-muted")}>
                {t("agencySignInNoAccount")}
              </p>
              <div className="flex justify-center">
                <Link
                  color="primary"
                  size="lg"
                  className="text-center font-semibold"
                  onClick={() => openAuthView(signUpView)}
                >
                  {t("agencyCreateAccount")}
                </Link>
              </div>
            </>
          )}
          {!showCreateAccount && !isAgency && (
            <>
              <p className={cn(bodyLargeTextClasses, "text-center text-muted")}>
                {t("chooseAccountNoAccount")}
              </p>
              <div className="flex justify-center">
                <Link
                  color="primary"
                  size="lg"
                  className="text-center font-semibold"
                  onClick={() => openAuthView(signUpView)}
                >
                  {t("chooseAccountCreateAccount")}
                </Link>
              </div>
            </>
          )}
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
