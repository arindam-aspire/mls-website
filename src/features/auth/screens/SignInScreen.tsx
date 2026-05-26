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
import {
  AUTH_QUERY_KEY,
  AUTH_VIEW,
  resolveEmailSignInView,
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { SignInForm } from "../components/SignInForm";
import { SignInFormValues } from "../types/auth.types";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { useSignInWithPassword } from "../mutations/auth.mutation";
import { useEffect } from "react";

type SignInScreenProps = {
  type: SocialAccountType;
  onSighinSuccess: () => void;
};

export function SignInScreen({ type, onSighinSuccess }: SignInScreenProps) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: signInWithPassword, isPending, isSuccess: isLoginSuccess } = useSignInWithPassword();
  const socialSignInView =
    type === "user" ? AUTH_VIEW.userSocialSignIn : AUTH_VIEW.ownerSocialSignIn;

  const signUpView =
    type === "user" ? AUTH_VIEW.userSocialSignUp : AUTH_VIEW.ownerSocialSignUp;

  const openAuthView = (view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  const onClickSignIn = (values: SignInFormValues) => {
    signInWithPassword(values);
  };

  useEffect(() => {
    if (isLoginSuccess) {
      onSighinSuccess();
    }
  }, [isLoginSuccess]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader
        showBack
        onBack={() =>
          router.replace(`${pathname}?${AUTH_QUERY_KEY}=${socialSignInView}`)
        }
      />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="flex flex-col gap-6 px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-bold text-secondary sm:text-2xl">
              {t("signInFormTitle")}
            </h2>
            <p className="text-sm text-muted">{t("signInFormSubtitle")}</p>
          </div>
          <SignInForm signInReturnView={resolveEmailSignInView(type)} onClickSignIn={onClickSignIn} isLoading={isPending} />
        </div>
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div className="space-y-2">
          <p className="text-center text-sm text-muted sm:text-base">
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
