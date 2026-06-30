"use client";

import { KeyRound } from "lucide-react";
import { useCallback, useState } from "react";
import { getLoggedInUser, changePassword } from "@/src/features/auth/services/auth.service";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { ChangePasswordForm } from "@/src/features/profile/components/ChangePasswordForm";
import type { ChangePasswordFormValues } from "@/src/features/profile/components/ChangePasswordForm";
import { useToast } from "@/src/hooks/useToast";
import { useRouter } from "@/src/i18n/navigation";

export function SetNewPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (values: ChangePasswordFormValues) => {
      try {
        setIsSubmitting(true);
        await changePassword({
          previous_password: values.currentPassword,
          password: values.newPassword,
        });
        const userResponse = await getLoggedInUser();
        setUser(userResponse.data);
        toast.success("Password updated", {
          description: "Your new password is active.",
        });
        router.replace("/dashboard");
      } catch (error) {
        toast.error("Password update failed", {
          description: error instanceof Error ? error.message : "Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, setUser, toast],
  );

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <KeyRound className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-text">Set new password</h1>
            <p className="mt-1 text-sm text-muted">
              Replace your temporary password before continuing.
            </p>
          </div>
        </div>

        <ChangePasswordForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </section>
    </main>
  );
}
