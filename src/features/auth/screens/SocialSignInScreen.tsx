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
} from "@/src/features/auth/authViews";
import { AuthModalHeader } from "../components/AuthModalHeader";
import {
  SocialAuthForm,
  type SocialAccountType,
} from "../components/SocialAuthForm";

type SocialSignInScreenProps = {
  type: SocialAccountType;
};

export function SocialSignInScreen({ type }: SocialSignInScreenProps) {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const signUpView =
    type === "user" ? AUTH_VIEW.userSocialSignUp : AUTH_VIEW.ownerSocialSignUp;

  const openAuthView = (view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="space-y-1 px-4 text-center sm:px-6">
          <h2 className="text-xl font-bold text-secondary sm:text-2xl">
            {t("chooseAccountSignInTitle")}
          </h2>
          <p className="text-sm text-muted">{t("socialSignInWelcome")}</p>
        </div>
        <SocialAuthForm flow="signin" accountType={type} />
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div className="space-y-2">
          <p className="text-center text-sm text-muted sm:text-base">
            {t("socialSignInNoAccount")}
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
