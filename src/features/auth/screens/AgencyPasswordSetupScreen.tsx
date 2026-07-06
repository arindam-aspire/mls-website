"use client";

import { KeyRound } from "lucide-react";
import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/ui";
import { ResetPasswordForm } from "@/src/features/auth/components/ResetPasswordForm";
import { setupAgencyPassword } from "@/src/features/profile/services/profile.service";
import { useToast } from "@/src/hooks/useToast";
import { useRouter } from "@/src/i18n/navigation";

export function AgencyPasswordSetupScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = searchParams.get("token")?.trim() ?? "";

  const handleSubmit = useCallback(
    async (password: string) => {
      if (!token) {
        toast.error("Password setup link is invalid", {
          description: "The activation token is missing. Please request a new link.",
        });
        return;
      }

      try {
        setIsSubmitting(true);
        await setupAgencyPassword({ token, password });
        toast.success("Agency activated", {
          description: "Your password has been created. You can now sign in.",
        });
        router.replace("/");
      } catch (error) {
        toast.error("Could not activate agency", {
          description: error instanceof Error ? error.message : "Please request a new link.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, toast, token],
  );

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="size-5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold text-text">Create agency password</h1>
            <p className="mt-1 text-sm text-muted">
              Set the password for your agency account to complete activation.
            </p>
          </div>
        </div>

        {!token ? (
          <div className="flex flex-col gap-4">
            <p className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              This password setup link is missing its activation token.
            </p>
            <Button type="button" color="primary" fullWidth onClick={() => router.replace("/")}>
              Back to sign in
            </Button>
          </div>
        ) : (
          <ResetPasswordForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        )}
      </section>
    </main>
  );
}
