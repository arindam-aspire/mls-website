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
import { AUTH_VIEW, buildAuthModalUrl } from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { SignInForm } from "../components/SignInForm";
import { SignInFormValues, resolveSignInRole } from "../types/auth.types";
import { useSignInWithPassword } from "../mutations/auth.mutation";
import { useAuthPortal, useIsAgentSignInPortal } from "../hooks/useAuthPortal";
import { useEffect } from "react";
import { cn } from "@/src/lib/cn";
import {
  headingAuthClasses,
  bodyTextClasses,
  bodyLargeTextClasses,
  captionTextClasses,
} from "@/src/lib/typography";

type AgencyEmailSignInScreenProps = {
  onSighinSuccess: () => void;
};

export function AgencyEmailSignInScreen({
  onSighinSuccess,
}: AgencyEmailSignInScreenProps) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const portal = useAuthPortal();
  const isAgent = useIsAgentSignInPortal();

  const { mutate: signInWithPassword, isPending, isSuccess: isLoginSuccess } =
    useSignInWithPassword();

  const openAuthView = (view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]) => {
    router.replace(
      buildAuthModalUrl(pathname, view, portal ? { portal } : undefined),
    );
  };

  const openAgencySignUp = () => {
    router.replace(
      buildAuthModalUrl(pathname, AUTH_VIEW.agencySignUp, {
        returnView: AUTH_VIEW.agencyEmailSignIn,
        portal: portal ?? undefined,
      }),
    );
  };

  const onClickSignIn = (values: SignInFormValues) => {
    signInWithPassword({
      ...values,
      role: resolveSignInRole(isAgent ? "agent" : "agency"),
    });
  };

  useEffect(() => {
    if (isLoginSuccess) {
      onSighinSuccess();
    }
  }, [isLoginSuccess, onSighinSuccess]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader
        showBack
        onBack={() =>
          router.replace(
            buildAuthModalUrl(pathname, AUTH_VIEW.agencySignIn, {
              portal: portal ?? undefined,
            }),
          )
        }
      />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="space-y-1 px-4 !pb-4 text-center sm:px-6">
            <h2 className={headingAuthClasses}>
              {t("signInFormTitle")}
            </h2>
            <p className={cn(bodyTextClasses, "text-muted")}>
              {isAgent ? t("agentSignInFormSubtitle") : t("signInFormSubtitle")}
            </p>
        </div>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <SignInForm
            signInReturnView={AUTH_VIEW.agencySignIn}
            onClickSignIn={onClickSignIn}
            isLoading={isPending}
          />
        </div>
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div className="space-y-2">
          {!isAgent && (
            <>
              <p className={cn(bodyLargeTextClasses, "text-center text-muted")}>
                {t("agencySignInNoAccount")}
              </p>
              <div className="flex justify-center">
                <Link
                  color="primary"
                  size="lg"
                  className="text-center font-semibold"
                  onClick={openAgencySignUp}
                >
                  {t("agencyCreateAccount")}
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
