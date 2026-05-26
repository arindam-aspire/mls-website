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
import { useEffect, useRef } from "react";
import {
  AUTH_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  isAgencyAuthView,
  isAuthView,
  resolveAuthSignUpView,
  type AuthView,
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import {
  SignInWithOTPForm,
  type SignInOtpMethod,
  type SignInWithOTPFormValues,
} from "../components/SignInWithOTPForm";
import { useSignInWithOtpRequest } from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";

function resolveReturnView(from: string | null): AuthView {
  if (isAuthView(from)) {
    return from;
  }
  return AUTH_VIEW.userSignIn;
}

export function SignInWithOTPScreen() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnView = resolveReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
  );
  const signUpView = resolveAuthSignUpView(returnView);
  const isAgency = isAgencyAuthView(returnView);
  const toast = useToast();
  const { mutate: requestOtp, isPending, isSuccess } = useSignInWithOtpRequest();
  const lastEmailRef = useRef<string | null>(null);

  const openAuthView = (view: AuthView) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  const handleBack = () => {
    openAuthView(returnView);
  };

  const handleFormSubmit = (
    values: SignInWithOTPFormValues,
    method: SignInOtpMethod,
  ) => {
    if (method === "phone") {
      toast.info("Coming Soon", {
        description: "Sign in via phone number is not available yet. Please use email instead.",
      });
      return;
    }

    lastEmailRef.current = values.email;
    requestOtp({ username: values.email });
  };

  useEffect(() => {
    if (isSuccess && lastEmailRef.current) {
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.otpVerify, {
          otpFlow: "signin",
          returnView,
          contactEmail: lastEmailRef.current,
        }),
      );
    }
  }, [isSuccess]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack onBack={handleBack} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="flex flex-col gap-6 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-secondary sm:text-2xl">
              {t("chooseAccountSignInTitle")}
            </h2>
            <p className="text-sm text-muted">{t("forgotPasswordSubtitle")}</p>
          </div>
          <SignInWithOTPForm
            onSubmit={handleFormSubmit}
            isLoading={isPending}
          />
        </div>
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div className="space-y-2">
          <p className="text-center text-sm text-muted sm:text-base">
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
