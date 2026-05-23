"use client";

import { Clock, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button, Input, Link } from "@/src/components/ui";
import { useForm } from "@/src/hooks/useForm";
import { cn } from "@/src/lib/cn";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { AUTH_VIEW, buildAuthModalUrl, type AuthView } from "../authViews";

export type SignInFormValues = {
  emailOrPhone: string;
  password: string;
  rememberMe: boolean;
};

type SignInFormProps = {
  signInReturnView?: AuthView;
};

export function SignInForm({
  signInReturnView = AUTH_VIEW.userSignIn,
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
      emailOrPhone: "",
      password: "",
      rememberMe: true,
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof SignInFormValues, string>> = {};

      if (!formValues.emailOrPhone.trim()) {
        nextErrors.emailOrPhone = t("signInEmailOrPhoneRequired");
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
      onSubmit={handleSubmit(() => {
        // Email sign-in submit — wire API when ready
      })}
      className="flex flex-col gap-6"
    >
      <div className="space-y-1 text-center">
        <h2 className="text-xl font-bold text-secondary sm:text-2xl">
          {t("signInFormTitle")}
        </h2>
        <p className="text-sm text-muted">{t("signInFormSubtitle")}</p>
      </div>

      <div className="flex flex-col gap-4">
        <Input
          name="emailOrPhone"
          type="text"
          autoComplete="username"
          label={t("signInEmailOrPhoneLabel")}
          placeholder={t("signInEmailOrPhonePlaceholder")}
          value={values.emailOrPhone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.emailOrPhone}
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
          <span className="text-sm text-text">{t("signInRememberMe")}</span>
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
        <Button type="submit" color="primary" size="lg" fullWidth className="font-semibold">
          {t("signIn")}
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-secondary/20" aria-hidden />
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
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

