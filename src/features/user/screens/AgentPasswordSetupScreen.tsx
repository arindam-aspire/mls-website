"use client";

import { KeyRound } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui";
import { ResetPasswordForm } from "@/src/features/auth/components/ResetPasswordForm";
import { setupAgentPassword } from "@/src/features/user/services/agent.service";
import { resolveAgentApiErrorMessage } from "@/src/features/user/utils/agentOnboardingErrors.utils";
import { useToast } from "@/src/hooks/useToast";
import { useRouter } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

export function AgentPasswordSetupScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const t = useTranslations("user.agents.passwordSetup");
  const tErrors = useTranslations("user.agents.errors");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const token = searchParams.get("token")?.trim() ?? "";

  const handleSubmit = useCallback(
    async (password: string) => {
      if (!token) {
        toast.error(t("missingTokenTitle"), {
          description: t("missingTokenDescription"),
        });
        return;
      }

      try {
        setIsSubmitting(true);
        const message = await setupAgentPassword({ token, password });
        setIsSuccess(true);
        toast.success(t("successTitle"), {
          description: message || t("successDescription"),
        });
      } catch (error) {
        toast.error(t("errorTitle"), {
          description: resolveAgentApiErrorMessage(error as Error, {
            duplicateEmail: tErrors("duplicateEmail"),
            duplicatePhone: tErrors("duplicatePhone"),
            invalidInvitation: tErrors("invalidInvitation"),
            expiredInvitation: tErrors("expiredInvitation"),
            validationError: tErrors("validationError"),
            generic: tErrors("generic"),
          }),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [t, tErrors, toast, token],
  );

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-xl border border-secondary/15 bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-text">{t("title")}</h1>
            <p className="mt-1 text-sm text-muted">{t("description")}</p>
          </div>
        </div>

        {!token ? (
          <div className="flex flex-col gap-4">
            <p className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              {t("missingTokenDescription")}
            </p>
            <Button type="button" color="primary" fullWidth onClick={() => router.replace("/")}>
              {t("backToSignIn")}
            </Button>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col gap-4">
            <p className="rounded-lg border border-success/20 bg-success/5 px-4 py-3 text-sm text-success">
              {t("successDescription")}
            </p>
            <Button type="button" color="primary" fullWidth onClick={() => router.replace("/")}>
              {t("backToSignIn")}
            </Button>
          </div>
        ) : (
          <ResetPasswordForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        )}
      </section>
    </main>
  );
}
