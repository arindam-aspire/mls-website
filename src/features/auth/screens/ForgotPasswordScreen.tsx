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
  isAuthView,
  type AuthView,
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import {
  ForgotPasswordForm,
  type ForgotPasswordMethod,
} from "../components/ForgotPasswordForm";
import type { ForgotPasswordFormValues } from "../types/auth.types";
import { useForgotPassword } from "../mutations/auth.mutation";
import { useToast } from "@/src/hooks/useToast";

function resolveReturnView(from: string | null): AuthView {
  if (isAuthView(from)) {
    return from;
  }
  return AUTH_VIEW.userSignIn;
}

export function ForgotPasswordScreen() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnView = resolveReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
  );

  const { mutate: forgotPasswordMutate, isPending, isSuccess } = useForgotPassword();
  const toast = useToast();

  const lastSubmitRef = useRef<{
    values: ForgotPasswordFormValues;
    method: ForgotPasswordMethod;
  } | null>(null);

  const handleBack = () => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${returnView}`);
  };

  const handleFormSubmit = (
    values: ForgotPasswordFormValues,
    method: ForgotPasswordMethod,
  ) => {
    if (method === "phone") {
      toast.info("Coming Soon", {
        description: "Password reset via phone number is not available yet. Please use email instead.",
      });
      return;
    }

    lastSubmitRef.current = { values, method };
    forgotPasswordMutate({
      email: values.email,
    });
  };

  useEffect(() => {
    if (isSuccess && lastSubmitRef.current) {
      const { values, method } = lastSubmitRef.current;
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.otpVerify, {
          otpFlow: "forgot",
          returnView: AUTH_VIEW.forgotPassword,
          contactEmail: method === "email" ? values.email : undefined,
          contactPhone:
            method === "phone" ? values.phoneNationalNumber : undefined,
          contactPhoneCountry:
            method === "phone" ? values.phoneCountryCode : undefined,
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
              {t("forgotPasswordTitle")}
            </h2>
            <p className="text-sm text-muted">{t("forgotPasswordSubtitle")}</p>
          </div>
          <ForgotPasswordForm
            onSubmit={handleFormSubmit}
            isLoading={isPending}
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
              onClick={handleBack}
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
