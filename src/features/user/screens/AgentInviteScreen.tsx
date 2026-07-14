"use client";

import { CheckCircle2, KeyRound, Mail, XCircle } from "lucide-react";
import { AgentOnboardingForm } from "@/src/features/user/components/AgentOnboardingForm";
import { useAgentInviteScreen } from "@/src/features/user/hooks/useAgentInviteScreen";
import { Button, CopyLinkBar } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";

export function AgentInviteScreen() {
  const {
    invitation,
    step,
    validationError,
    submitError,
    isSubmitting,
    resolvedPasswordSetupLink,
    onboardingForm,
    labels,
    handlers,
  } = useAgentInviteScreen();

  const statusLabel =
    invitation?.status?.trim().toUpperCase() === "ACTIVE"
      ? labels.statusActive
      : labels.statusPendingPassword;

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
        ) : step === "active" ? (
          <div className="flex flex-col gap-5">
            <div className="flex gap-3 rounded-lg border border-success/20 bg-success/5 p-4 text-success">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-medium">{labels.activeTitle}</p>
                <p className="mt-1 text-sm">{labels.activeDescription}</p>
              </div>
            </div>
            <Button type="button" color="primary" size="lg" onClick={handlers.onGoToSignIn}>
              {labels.goToSignIn}
            </Button>
          </div>
        ) : step === "passwordInstruction" ? (
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border border-secondary/15 bg-page/60 p-4">
              <p className="text-sm font-medium text-text">{statusLabel}</p>
              <p className="mt-2 text-sm text-muted">{labels.passwordInstructionDescription}</p>
              <p className="mt-2 text-sm text-muted">{labels.passwordInstructionHint}</p>
            </div>

            {resolvedPasswordSetupLink ? (
              <CopyLinkBar
                label={labels.setupLinkLabel}
                value={resolvedPasswordSetupLink}
                copyLabel={labels.copySetupLink}
                onCopy={handlers.onCopyPasswordSetupLink}
              />
            ) : null}

            <Button
              type="button"
              color="primary"
              size="lg"
              fullWidth
              className={cn("font-semibold")}
              iconStart={<KeyRound className="size-5" aria-hidden />}
              onClick={handlers.onOpenPasswordSetup}
              disabled={!resolvedPasswordSetupLink}
            >
              {labels.openPasswordSetup}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <AgentOnboardingForm
              {...onboardingForm.formState}
              serviceAreaOptions={onboardingForm.serviceAreaOptions}
              {...onboardingForm.labels}
              fullNameError={onboardingForm.errors.fullName}
              emailError={onboardingForm.errors.email}
              phoneError={onboardingForm.errors.phone}
              whatsappError={onboardingForm.errors.whatsappNumber}
              serviceAreaError={onboardingForm.errors.serviceArea}
              positionError={onboardingForm.errors.position}
              identityDocumentError={onboardingForm.errors.identityDocument}
              identityDocumentFileName={onboardingForm.formState.identityDocumentFileName}
              disabled={isSubmitting}
              isEmailReadOnly={onboardingForm.isEmailReadOnly}
              isServiceAreaLoading={onboardingForm.isServiceAreaLoading}
              isIdentityDocumentUploading={onboardingForm.isIdentityDocumentUploading}
              {...onboardingForm.handlers}
            />

            {submitError ? (
              <p className="rounded-lg border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
                {submitError}
              </p>
            ) : null}

            <Button
              type="button"
              color="primary"
              size="lg"
              fullWidth
              className={cn("font-semibold")}
              isLoading={isSubmitting}
              loadingLabel={labels.submittingProfile}
              onClick={handlers.onSubmitProfile}
            >
              {labels.submitProfile}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
