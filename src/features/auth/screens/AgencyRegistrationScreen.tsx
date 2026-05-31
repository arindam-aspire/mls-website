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
  AUTH_RETURN_VIEW_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
  isAuthView,
  resolveAgencySignUpBackUrl,
  type AuthView,
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { AgencySignUpForm } from "../components/AgencySignUpForm";
import { useAgencySignUp } from "../mutations/auth.mutation";
import type { AgencySignUpSubmitValues } from "../types/auth.types";
import { useAuthStore } from "../store/auth.store";
import { cn } from "@/src/lib/cn";
import {
  headingAuthClasses,
  bodyTextClasses,
  bodyLargeTextClasses,
  captionTextClasses,
} from "@/src/lib/typography";

function resolveReturnView(from: string | null): AuthView | null {
  if (isAuthView(from)) {
    return from;
  }
  return null;
}

export function AgencyRegistrationScreen() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnView = resolveReturnView(
    searchParams.get(AUTH_RETURN_VIEW_QUERY_KEY),
  );

  const { mutate: agencySignUpMutate, isPending, isSuccess } = useAgencySignUp();
  const setPendingAgencySignUp = useAuthStore((s) => s.setPendingAgencySignUp);
  const pendingAgencySignUp = useAuthStore((s) => s.pendingAgencySignUp);

  const openAuthView = (view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]) => {
    router.replace(buildAuthModalUrl(pathname, view));
  };

  const handleBack = () => {
    router.replace(resolveAgencySignUpBackUrl(pathname, returnView));
  };

  const handleFormSubmit = (values: AgencySignUpSubmitValues) => {
    setPendingAgencySignUp(values);
    agencySignUpMutate({
      agency_name: values.agencyName,
      agency_trade_name: values.tradeName,
      email: values.email,
      phone: values.phone,
      password: values.password,
      legal_document: values.legalDocument,
    });
  };

  useEffect(() => {
    if (isSuccess && pendingAgencySignUp?.email) {
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.confirmSignUp, {
          returnView: AUTH_VIEW.agencySignUp,
          contactEmail: pendingAgencySignUp.email,
        }),
      );
    }
  }, [isSuccess, pendingAgencySignUp, pathname, router]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack onBack={handleBack} />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="space-y-1 px-4 !pb-4 text-center sm:px-6">
            <h2 className={headingAuthClasses}>
              {t("agencySignUpTitle")}
            </h2>
            <p className={cn(bodyTextClasses, "text-muted")}>{t("agencySignUpSubtitle")}</p>
        </div>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <AgencySignUpForm onSubmit={handleFormSubmit} isLoading={isPending} />
        </div>
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div className="space-y-2">
          <p className={cn(bodyLargeTextClasses, "text-center text-muted")}>
            {t("agencySignUpHasAccount")}
          </p>
          <div className="flex justify-center">
            <Link
              color="primary"
              size="lg"
              className="text-center font-semibold"
              onClick={() => openAuthView(AUTH_VIEW.agencySignIn)}
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
