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
  AUTH_OTP_PHONE_COUNTRY_QUERY_KEY,
  AUTH_OTP_PHONE_QUERY_KEY,
  AUTH_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  isAuthView,
  type AuthView,
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { OTPVerificationForm } from "../components/OTPVerificationForm";
import { useConfirmSignUp, useSignUp } from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";

function resolveReturnView(from: string | null): AuthView {
  if (isAuthView(from)) {
    return from;
  }
  return AUTH_VIEW.userSignUp;
}

export function ConfirmSignUpScreen() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const toast = useToast();

  const returnView = resolveReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
  );
  const contactEmail = searchParams.get(AUTH_OTP_EMAIL_QUERY_KEY) ?? undefined;
  const contactPhone = searchParams.get(AUTH_OTP_PHONE_QUERY_KEY) ?? undefined;
  const contactPhoneCountry =
    searchParams.get(AUTH_OTP_PHONE_COUNTRY_QUERY_KEY) ?? undefined;

  const signInView =
    returnView === AUTH_VIEW.ownerSignUp
      ? AUTH_VIEW.ownerSocialSignIn
      : AUTH_VIEW.userSocialSignIn;

  const {
    mutate: confirmSignUpMutate,
    isPending: isVerifying,
    isSuccess: isVerifySuccess,
  } = useConfirmSignUp();

  const { mutate: resendSignUp, isPending: isResending } = useSignUp();

  const openAuthView = (view: AuthView) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  const handleBack = () => {
    openAuthView(returnView);
  };

  const handleSubmit = (code: string) => {
    if (!contactEmail) return;
    confirmSignUpMutate({ email: contactEmail, otp: code });
  };

  const handleResend = () => {
    if (!contactEmail) {
      toast.info("Unable to resend", {
        description: "Email address is missing.",
      });
      return;
    }

    resendSignUp({
      full_name: "",
      email: contactEmail,
      phone_number: contactPhone ? `${contactPhoneCountry ?? ""} ${contactPhone}` : "",
      password: "",
    });
  };

  useEffect(() => {
    if (isVerifySuccess) {
      openAuthView(signInView);
    }
  }, [isVerifySuccess]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack onBack={handleBack} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <OTPVerificationForm
            otpFlow="signup"
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
          <p className="text-center text-sm text-muted sm:text-base">
            {t("socialSignUpHasAccount")}
          </p>
          <div className="flex justify-center">
            <Link
              color="primary"
              size="lg"
              className="text-center font-semibold"
              onClick={() => openAuthView(signInView)}
            >
              {t("socialSignUpLogIn")}
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-1 text-xs text-muted sm:text-sm">
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
