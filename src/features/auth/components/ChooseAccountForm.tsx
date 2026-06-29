"use client";

import { Clock, Globe, Info, Mail } from "lucide-react";
import { Button } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { authFormOverlineClasses, bodyTextClasses } from "@/src/lib/typography";
import { AUTH_VIEW } from "../authViews";
import { useAuthStore } from "../store/auth.store";
import type { ChooseAccountMode, ChooseAccountType } from "../types/chooseAccount.types";

export type { ChooseAccountMode, ChooseAccountType } from "../types/chooseAccount.types";
export { CHOOSE_ACCOUNT_TYPES } from "../types/chooseAccount.types";

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
          iconStart={<Globe className="size-5" aria-hidden />}
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
          iconStart={<Globe className="size-5" aria-hidden />}
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
          iconStart={<Globe className="size-5" aria-hidden />}
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
