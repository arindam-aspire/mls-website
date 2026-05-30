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
import { AUTH_QUERY_KEY, AUTH_VIEW } from "@/src/features/auth/authViews";
import { AgencyAuthForm } from "../components/AgencyAuthForm";
import { AuthModalHeader } from "../components/AuthModalHeader";
import { Shield } from "lucide-react";
import { cn } from "@/src/lib/cn";
import {
  headingAuthClasses,
  bodyTextClasses,
  bodyLargeTextClasses,
  captionTextClasses,
  authBadgeClasses,
} from "@/src/lib/typography";

export function AgencySignInScreen() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const openAuthView = (view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  return (
    <ModalPanel size="md">
      <AuthModalHeader showBack />
      <ModalCloseButton />
      <ModalContent className="!py-0 sm:!py-0">
        <div className="flex flex-col items-center gap-4 px-4 sm:px-6">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-secondary/30",
              "bg-secondary-light px-4 py-1.5 font-semibold text-secondary-dark",
              authBadgeClasses,
            )}
          >
            <Shield className="size-4 shrink-0" aria-hidden />
            <span>{t("agencyPortalBadge")}</span>
          </div>
          <div className="space-y-1 text-center">
            <h2 className={headingAuthClasses}>
              {t("chooseAccountSignInTitle")}
            </h2>
            <p className={cn(bodyTextClasses, "text-muted")}>{t("agencySignInSubtitle")}</p>
          </div>
        </div>
        <AgencyAuthForm />
      </ModalContent>
      <ModalFooter className="!block rounded-b-xl border-t-0 bg-primary-light !px-4 !pt-4 !pb-4 dark:bg-page sm:!gap-3 sm:!px-6 sm:!pb-6">
        <div className="space-y-2">
          <p className={cn(bodyLargeTextClasses, "text-center text-muted")}>
            {t("agencySignInNoAccount")}
          </p>
          <div className="flex justify-center">
            <Link
              color="primary"
              size="lg"
              className="text-center font-semibold"
              onClick={() => openAuthView(AUTH_VIEW.agencySignUp)}
            >
              {t("agencyCreateAccount")}
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
