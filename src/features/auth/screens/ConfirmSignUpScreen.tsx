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
import {
  AUTH_OTP_EMAIL_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  isAuthView,
  resolveSignInViewFromSignUpReturnView,
  type AuthView,
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { OTPVerificationForm } from "../components/OTPVerificationForm";
import {
  useAgencySignUp,
  useConfirmSignUp,
  useSignUp,
} from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";
import { useAuthStore } from "../store/auth.store";
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
  const pendingAgencySignUp = useAuthStore((s) => s.pendingAgencySignUp);
  const clearPendingSignUp = useAuthStore((s) => s.clearPendingSignUp);
  const clearPendingAgencySignUp = useAuthStore((s) => s.clearPendingAgencySignUp);

  const returnView = resolveReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
  );
  const isAgencyConfirm = returnView === AUTH_VIEW.agencySignUp;
  const contactEmail =
    searchParams.get(AUTH_OTP_EMAIL_QUERY_KEY)?.trim() ||
    (isAgencyConfirm ? pendingAgencySignUp?.email : pendingSignUp?.email);
  const contactPhone = isAgencyConfirm ? undefined : pendingSignUp?.phone_number;

  const signInView = resolveSignInViewFromSignUpReturnView(returnView);

  const { mutate: confirmSignUpMutate, isPending: isVerifying } =
    useConfirmSignUp();

  const { mutate: resendUserSignUp, isPending: isResendingUserSignUp } =
    useSignUp();
  const { mutate: resendAgencySignUp, isPending: isResendingAgencySignUp } =
    useAgencySignUp();
  const isResending = isAgencyConfirm
    ? isResendingAgencySignUp
    : isResendingUserSignUp;

  const clearPendingRegistration = () => {
    clearPendingSignUp();
    clearPendingAgencySignUp();
  };

  const openAuthView = (view: AuthView) => {
    router.replace(buildAuthModalUrl(pathname, view));
  };

  const handleBack = () => {
    clearPendingRegistration();
    openAuthView(returnView);
  };

  const handleSubmit = (code: string) => {
    if (!contactEmail?.trim()) {
      toast.info("Unable to verify", {
        description: "Email address is missing.",
      });
      return;
    }

    confirmSignUpMutate(
      {
        email: contactEmail.trim(),
        code,
      },
      {
        onSuccess: () => {
          clearPendingRegistration();
          router.replace(buildAuthModalUrl(pathname, signInView));
        },
      },
    );
  };

  const handleResend = () => {
    if (isAgencyConfirm) {
      if (!pendingAgencySignUp) {
        toast.info("Unable to resend", {
          description: "Registration details are missing.",
        });
        return;
      }

      resendAgencySignUp({
        agency_name: pendingAgencySignUp.agencyName,
        agency_trade_name: pendingAgencySignUp.tradeName,
        email: pendingAgencySignUp.email,
        phone: pendingAgencySignUp.phone,
        password: pendingAgencySignUp.password,
        legal_document: pendingAgencySignUp.legalDocument,
      });
      return;
    }

    if (!pendingSignUp) {
      toast.info("Unable to resend", {
        description: "Email address is missing.",
      });
      return;
    }

    resendUserSignUp(pendingSignUp);
  };

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack onBack={handleBack} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="space-y-1 px-4 !pb-4 text-center sm:px-6">
            <h2 className={headingAuthClasses}>
              {t("confirmSignUpTitle")}
            </h2>
            <p className={cn(bodyTextClasses, "text-muted")}>{t("confirmSignUpSubtitle")}</p>
        </div>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
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
          <p className={cn(bodyLargeTextClasses, "text-center text-muted")}>
            {isAgencyConfirm ? t("agencySignUpHasAccount") : t("socialSignUpHasAccount")}
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
