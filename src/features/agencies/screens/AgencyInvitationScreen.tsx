"use client";

import { CheckCircle2, KeyRound, Mail, XCircle } from "lucide-react";
import { AgencyInvitationForm } from "@/src/features/agencies/components/AgencyInvitationForm";
import { useAgencyInvitationScreen } from "@/src/features/agencies/hooks/useAgencyInvitationScreen";
import { Button, CopyLinkBar } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";

export function AgencyInvitationScreen() {
  const {
    step,
    validationError,
    submitError,
    isSubmitting,
    isUploading,
    passwordSetupLink,
    initialValues,
    formKey,
    labels,
    handlers,
  } = useAgencyInvitationScreen();

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-page px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-xl flex-col rounded-xl border border-secondary/15 bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-text">{labels.title}</h1>
            <p className="mt-1 text-sm text-muted">{labels.subtitle}</p>
          </div>
        </div>

        {step === "loading" ? (
          <p className="text-sm text-muted">{labels.loading}</p>
        ) : step === "error" ? (
          <div className="flex gap-3 rounded-lg border border-danger/20 bg-danger/5 p-4 text-danger">
            <XCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">{labels.errorTitle}</p>
              <p className="mt-1 text-sm">{validationError}</p>
            </div>
          </div>
        ) : step === "success" ? (
          <div className="flex flex-col gap-5">
            <div className="flex gap-3 rounded-lg border border-success/20 bg-success/5 p-4 text-success">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-medium">{labels.successTitle}</p>
                <p className="mt-1 text-sm">{labels.successDescription}</p>
              </div>
            </div>

            {passwordSetupLink ? (
              <>
                <CopyLinkBar
                  label={labels.setupLinkLabel}
                  value={passwordSetupLink}
                  copyLabel={labels.copySetupLink}
                  onCopy={handlers.onCopyPasswordSetupLink}
                />
                <Button
                  type="button"
                  color="primary"
                  size="lg"
                  fullWidth
                  className={cn("font-semibold")}
                  iconStart={<KeyRound className="size-5" aria-hidden />}
                  onClick={handlers.onOpenPasswordSetup}
                >
                  {labels.openPasswordSetup}
                </Button>
              </>
            ) : (
              <Button type="button" color="primary" size="lg" onClick={handlers.onGoToSignIn}>
                {labels.goToSignIn}
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <AgencyInvitationForm
              key={formKey}
              initialValues={initialValues}
              onSubmit={handlers.onSubmit}
              isLoading={isSubmitting}
              isUploading={isUploading}
            />

            {submitError ? (
              <p className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
                {submitError}
              </p>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}
