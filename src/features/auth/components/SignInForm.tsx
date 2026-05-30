"use client";

import { Clock, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input, Link } from "@/src/components/ui";
import { useForm } from "@/src/hooks/useForm";
import { cn } from "@/src/lib/cn";
import { authFormOverlineClasses, bodyTextClasses } from "@/src/lib/typography";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_VIEW, buildAuthModalUrl, type AuthView } from "../authViews";
import { SignInFormValues } from "../types/auth.types";



type SignInFormProps = {
  signInReturnView?: AuthView;
  onClickSignIn: (values: SignInFormValues) => void;
  isLoading: boolean;
};

export function SignInForm({
  signInReturnView = AUTH_VIEW.userSignIn,
  onClickSignIn,
  isLoading,
}: SignInFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm<SignInFormValues>({
    initialValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof SignInFormValues, string>> = {};

      if (!formValues.username?.trim()) {
        nextErrors.username = t("signInEmailOrPhoneRequired");
      }

      if (!formValues.password) {
        nextErrors.password = t("signInPasswordRequired");
      }

      return nextErrors;
    },
  });

  const openAuthView = (
    view: AuthView,
    returnView?: AuthView,
  ) => {
    router.replace(buildAuthModalUrl(pathname, view, returnView));
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onClickSignIn)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <Input
          name="username"
          type="text"
          autoComplete="username"
          label={t("signInEmailOrPhoneLabel")}
          placeholder={t("signInEmailOrPhonePlaceholder")}
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.username}
          iconStart={<Mail className="size-4" aria-hidden />}
          isRequired
        />

        <Input
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          label={t("signInPasswordLabel")}
          placeholder={t("signInPasswordPlaceholder")}
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.password}
          iconStart={<Lock className="size-4" aria-hidden />}
          iconEnd={
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="inline-flex shrink-0 text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 rounded-lg"
              aria-label={
                showPassword
                  ? t("signInHidePassword")
                  : t("signInShowPassword")
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          }
          isRequired
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex min-w-0 cursor-pointer items-center gap-2">
          <input
            name="rememberMe"
            type="checkbox"
            checked={values.rememberMe}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, rememberMe: e.target.checked }))
            }
            className={cn(
              "size-4 shrink-0 rounded-lg border-secondary/30 bg-surface text-primary",
              "focus:ring-2 focus:ring-primary/40 focus:ring-offset-0",
            )}
          />
          <span className={cn(bodyTextClasses, "text-text")}>{t("signInRememberMe")}</span>
        </label>
        <Link
          color="primary"
          size="sm"
          className="shrink-0 font-medium"
          onClick={() =>
            openAuthView(AUTH_VIEW.forgotPassword, signInReturnView)
          }
        >
          {t("signInForgotPassword")}
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <Button type="submit" color="primary" size="lg" fullWidth className="font-semibold" isLoading={isLoading} loadingLabel={t("signingIn")} iconStart={<LogIn className="size-5" aria-hidden />}>
          {t("signIn")}
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-secondary/20" aria-hidden />
          <span className={authFormOverlineClasses}>
            {t("orDivider")}
          </span>
          <div className="h-px flex-1 bg-secondary/20" aria-hidden />
        </div>

        <Button
          type="button"
          variant="outline"
          color="inherit"
          size="lg"
          fullWidth
          className="font-semibold"
          iconStart={<Clock className="size-5" aria-hidden />}
          onClick={() =>
            openAuthView(AUTH_VIEW.signInOtp, signInReturnView)
          }
        >
          {t("loginWithOneTimeCode")}
        </Button>
      </div>
    </form>
  );
}

