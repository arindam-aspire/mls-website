"use client";

import { Clock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import type { SVGProps } from "react";
import { Button, ToggleButton } from "@/src/components/ui";
import { cn } from "@/lib/cn";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  AUTH_QUERY_KEY,
  AUTH_VIEW,
  resolveAccountTypeAuthView,
  resolveEmailSignInView,
  resolveEmailSignUpView,
} from "./AuthModal";

type BrandIconProps = SVGProps<SVGSVGElement>;

function GoogleIcon(props: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FacebookIcon(props: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="#1877F2"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"
      />
    </svg>
  );
}

function AppleIcon(props: BrandIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </svg>
  );
}

export type SocialAccountType = "user" | "owner";
export type SocialAuthFlow = "signin" | "signup";

type SocialAuthFormProps = {
  flow: SocialAuthFlow;
  accountType: SocialAccountType;
  className?: string;
};

export function SocialAuthForm({
  flow,
  accountType,
  className,
}: SocialAuthFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();

  const title =
    flow === "signin"
      ? t("chooseAccountSignInTitle")
      : t("chooseAccountSignUpTitle");

  const subtitle =
    flow === "signin"
      ? t("socialSignInWelcome")
      : t("socialSignUpWelcome");

  const emailLabel =
    flow === "signin" ? t("loginWithEmail") : t("signUpWithEmail");

  const facebookLabel =
    flow === "signin" ? t("loginWithFacebook") : t("continueWithFacebook");

  const appleLabel =
    flow === "signin" ? t("loginWithApple") : t("continueWithApple");

  const handleAccountTypeChange = (type: SocialAccountType) => {
    const view = resolveAccountTypeAuthView(type, flow);
    if (view != null) {
      router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
    }
  };

  const openAuthView = (view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  return (
    <div className={cn("flex flex-col gap-6 px-4 pb-4 sm:px-6 sm:pb-6", className)}>
      <ToggleButton<SocialAccountType>
        className="w-full"
        color="primary"
        size="md"
        isRounded
        variant="ghost"
        value={accountType}
        onChange={handleAccountTypeChange}
        aria-label={t("socialAccountTypeLabel")}
        items={[
          { value: "user", label: t("accountTypeUserTitle") },
          { value: "owner", label: t("accountTypeOwnerTitle") },
        ]}
      />
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-secondary sm:text-2xl">{title}</h2>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          color="inherit"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<GoogleIcon className="size-5" />}
        >
          {t("continueWithGoogle")}
        </Button>
        <Button
          type="button"
          variant="outline"
          color="inherit"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<FacebookIcon className="size-5" />}
        >
          {facebookLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          color="inherit"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<AppleIcon className="size-5" />}
        >
          {appleLabel}
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-secondary/20" aria-hidden />
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {t("orDivider")}
        </span>
        <div className="h-px flex-1 bg-secondary/20" aria-hidden />
      </div>
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="solid"
          color="primary"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<Mail className="size-5" aria-hidden />}
          onClick={() => {
            if (flow === "signin") {
              openAuthView(resolveEmailSignInView(accountType));
            } else {
              openAuthView(resolveEmailSignUpView(accountType));
            }
          }}
        >
          {emailLabel}
        </Button>
        {flow === "signin" && (
          <Button
            type="button"
            variant="outline"
            color="inherit"
            size="lg"
            fullWidth
            className="font-semibold"
            iconStart={<Clock className="size-5" aria-hidden />}
            onClick={() => openAuthView(AUTH_VIEW.signInOtp)}
          >
            {t("loginWithOneTimeCode")}
          </Button>
        )}
      </div>
    </div>
  );
}
