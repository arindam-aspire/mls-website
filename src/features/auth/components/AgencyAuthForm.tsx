"use client";

import { Clock, Info, Mail, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  AUTH_QUERY_KEY,
  AUTH_VIEW,
  buildAuthModalUrl,
} from "../authViews";

type AgencyAuthFormProps = {
  className?: string;
};

export function AgencyAuthForm({ className }: AgencyAuthFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const pathname = usePathname();

  const openAuthView = (view: (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW]) => {
    router.replace(`${pathname}?${AUTH_QUERY_KEY}=${view}`);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 px-4 pb-4 sm:px-6 sm:pb-6",
        className,
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-full border border-secondary/30",
            "bg-secondary-light px-4 py-1.5 text-sm font-semibold text-secondary-dark",
          )}
        >
          <Shield className="size-4 shrink-0" aria-hidden />
          <span>{t("agencyPortalBadge")}</span>
        </div>

        <div className="space-y-1 text-center">
          <h2 className="text-xl font-bold text-secondary sm:text-2xl">
            {t("chooseAccountSignInTitle")}
          </h2>
          <p className="text-sm text-muted">{t("agencySignInSubtitle")}</p>
        </div>
      </div>

      <div
        role="note"
        className="flex gap-3 rounded-xl border border-tertiary-dark/25 bg-tertiary-light p-4"
      >
        <Info
          className="mt-0.5 size-5 shrink-0 text-tertiary-dark"
          aria-hidden
        />
        <p className="text-sm leading-relaxed text-text">
          {t("agencyNoSocialSignInNote")}
        </p>
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
          onClick={() => openAuthView(AUTH_VIEW.agencyEmailSignIn)}
        >
          {t("agencyLoginWithEmailPassword")}
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
            router.replace(
              buildAuthModalUrl(pathname, AUTH_VIEW.signInOtp, {
                returnView: AUTH_VIEW.agencySignIn,
              }),
            )
          }
        >
          {t("loginWithOneTimeCode")}
        </Button>
      </div>
    </div>
  );
}

