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
import { useAuthStore } from "../store/auth.store";

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

  const pendingSignUp = useAuthStore((s) => s.pendingSignUp);
  const clearPendingSignUp = useAuthStore((s) => s.clearPendingSignUp);

  const returnView = resolveReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
  );
  const contactEmail = pendingSignUp?.email;
  const contactPhone = pendingSignUp?.phone_number;

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
    clearPendingSignUp();
    openAuthView(returnView);
  };

  const handleSubmit = (code: string) => {
    if (!contactEmail) return;
    confirmSignUpMutate({ email: contactEmail, code });
  };

  const handleResend = () => {
    if (!pendingSignUp) {
      toast.info("Unable to resend", {
        description: "Email address is missing.",
      });
      return;
    }

    resendSignUp(pendingSignUp);
  };

  useEffect(() => {
    if (isVerifySuccess) {
      clearPendingSignUp();
      openAuthView(signInView);
    }
  }, [isVerifySuccess]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack onBack={handleBack} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="flex flex-col gap-6 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-secondary sm:text-2xl">
              {t("confirmSignUpTitle")}
            </h2>
            <p className="text-sm text-muted">{t("confirmSignUpSubtitle")}</p>
          </div>
          <OTPVerificationForm
            otpFlow="signup"
            contactEmail={contactEmail}
            contactPhone={contactPhone}
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
