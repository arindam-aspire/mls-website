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
import { useEffect, useRef } from "react";
import { AUTH_QUERY_KEY, AUTH_VIEW, buildAuthModalUrl } from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { SignUpForm } from "../components/SignUpForm";
import type { SocialAccountType } from "../components/SocialAuthForm";
import type { SignUpFormValues } from "../types/auth.types";
import { useSignUp } from "../mutations/auth.mutation";

type UserRegistrationScreenProps = {
  type: SocialAccountType;
};

export function UserRegistrationScreen({ type }: UserRegistrationScreenProps) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const socialSignUpView =
    type === "user" ? AUTH_VIEW.userSocialSignUp : AUTH_VIEW.ownerSocialSignUp;

  const signInView =
    type === "user" ? AUTH_VIEW.userSocialSignIn : AUTH_VIEW.ownerSocialSignIn;

  const { mutate: signUpMutate, isPending, isSuccess } = useSignUp();
  const lastSubmitRef = useRef<SignUpFormValues | null>(null);

  const openAuthView = (view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  const handleFormSubmit = (values: SignUpFormValues) => {
    lastSubmitRef.current = values;
    signUpMutate(values);
  };

  useEffect(() => {
    if (isSuccess && lastSubmitRef.current) {
      const values = lastSubmitRef.current;
      const returnView = type === "user" ? AUTH_VIEW.userSignUp : AUTH_VIEW.ownerSignUp;
      router.replace(
        buildAuthModalUrl(pathname, AUTH_VIEW.confirmSignUp, {
          returnView,
          contactEmail: values.email,
        }),
      );
    }
  }, [isSuccess]);

  return (
    <ModalPanel size="md">
      <AuthModalHeader
        showBack
        onBack={() =>
          router.replace(`${pathname}?${AUTH_QUERY_KEY}=${socialSignUpView}`)
        }
      />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <SignUpForm onSubmit={handleFormSubmit} isLoading={isPending} />
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
