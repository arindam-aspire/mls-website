"use client";

import { Clock, Info, Mail } from "lucide-react";
import type { SVGProps } from "react";
import { Button } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { authFormOverlineClasses, bodyTextClasses } from "@/src/lib/typography";
import { AUTH_VIEW } from "../authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type { ChooseAccountMode, ChooseAccountType } from "../types/chooseAccount.types";

export type { ChooseAccountMode, ChooseAccountType } from "../types/chooseAccount.types";
export { CHOOSE_ACCOUNT_TYPES } from "../types/chooseAccount.types";

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

type ChooseAccountFormProps = {
  mode: ChooseAccountMode;
  onModeChange: (mode: ChooseAccountMode) => void;
  onAccountTypeSelect?: (type: ChooseAccountType) => void;
  className?: string;
};

export function ChooseAccountForm({
  mode: _mode,
  onModeChange: _onModeChange,
  onAccountTypeSelect,
  className,
}: ChooseAccountFormProps) {
  const navigate = useAuthStore((state) => state.navigate);

  const handleSocialClick = () => {
    navigate(AUTH_VIEW.userSocialSignIn);
    onAccountTypeSelect?.("user");
  };

  return (
    <div className={cn("flex flex-col gap-6 px-4 sm:px-6 pb-4 sm:pb-6", className)}>
      <div className="flex flex-col gap-3">
        <Button
          type="button"
          variant="outline"
          color="inherit"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<GoogleIcon className="size-5" />}
          onClick={handleSocialClick}
        >
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          color="inherit"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<FacebookIcon className="size-5" />}
          onClick={handleSocialClick}
        >
          Sign in with Facebook
        </Button>
        <Button
          type="button"
          variant="outline"
          color="inherit"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<AppleIcon className="size-5" />}
          onClick={handleSocialClick}
        >
          Sign in with Apple
        </Button>
        <div
          role="note"
          className="flex gap-3 rounded-xl border border-secondary/15 bg-primary-light p-4"
        >
          <Info
            className="mt-0.5 size-5 shrink-0 text-primary-dark"
            aria-hidden
          />
          <p className={cn(bodyTextClasses, "leading-relaxed text-primary-dark")}>
            Social login is available only for Property Owners and Users.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-secondary/20" aria-hidden />
        <span className={authFormOverlineClasses}>OR</span>
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
          onClick={() => navigate(AUTH_VIEW.userSignIn)}
        >
          Sign in with Email
        </Button>
        <Button
          type="button"
          variant="outline"
          color="inherit"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<Clock className="size-5" aria-hidden />}
          onClick={() => navigate(AUTH_VIEW.signInOtp)}
        >
          Sign in with One-Time Password (OTP)
        </Button>
      </div>
    </div>
  );
}
