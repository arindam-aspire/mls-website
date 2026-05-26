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
  AUTH_OTP_FLOW_QUERY_KEY,
  AUTH_OTP_PHONE_COUNTRY_QUERY_KEY,
  AUTH_OTP_PHONE_QUERY_KEY,
  AUTH_QUERY_KEY,
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  isAuthView,
  type AuthOtpFlow,
  type AuthView,
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { ResetPasswordForm } from "../components/ResetPasswordForm";

function resolveReturnView(from: string | null): AuthView {
  if (isAuthView(from)) {
    return from;
  }
  return AUTH_VIEW.userSignIn;
}

function resolveOtpFlow(value: string | null): AuthOtpFlow {
  return value === "forgot" ? "forgot" : "signin";
}

export function ResetPasswordScreen() {
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

  const handleBack = () => {
    if (otpFlow === "forgot") {
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.otpVerify, {
          returnView,
          otpFlow: "forgot",
          contactEmail,
          contactPhone,
          contactPhoneCountry,
        }),
      );
      return;
    }

    router.replace(
      buildAuthModalUrl(pathname, AUTH_VIEW.signInOtp, returnView),
    );
  };

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack onBack={handleBack} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="flex flex-col gap-6 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-secondary sm:text-2xl">
              {t("resetPasswordTitle")}
            </h2>
            <p className="text-sm text-muted">{t("resetPasswordSubtitle")}</p>
          </div>
          <ResetPasswordForm returnView={returnView} />
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
              onClick={() =>
                router.replace(
                  buildAuthModalUrl(pathname, returnView),
                )
              }
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
