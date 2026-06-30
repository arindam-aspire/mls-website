"use client";

import { CheckCircle2, Eye, EyeOff, KeyRound, Lock, Mail, XCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input } from "@/src/components/ui";
import { PasswordStrengthIndicator } from "@/src/components/common/PasswordStrengthIndicator";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import {
  acceptAgentInvitation,
  validateAgentInvitation,
} from "../services/agent.service";
import type { AgentInvitationPreview } from "../types/agent.types";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/;

export function AgentInviteScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token")?.trim() ?? "";
  const [invitation, setInvitation] = useState<AgentInvitationPreview | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadInvitation() {
      if (!token) {
        setValidationError("Invitation token is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await validateAgentInvitation(token);
        if (!cancelled) {
          setInvitation(data);
          setValidationError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setValidationError(error instanceof Error ? error.message : "Invitation link is invalid.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadInvitation();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const passwordError = useMemo(() => {
    if (!password) return "Password is required.";
    if (!PASSWORD_PATTERN.test(password)) {
      return "Use at least 8 characters with upper, lower, number, and special character.";
    }
    return null;
  }, [password]);

  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword) return "Confirm your password.";
    if (confirmPassword !== password) return "Passwords do not match.";
    return null;
  }, [confirmPassword, password]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitError(null);

      if (!token || passwordError || confirmPasswordError) {
        return;
      }

      try {
        setIsSubmitting(true);
        const message = await acceptAgentInvitation({ token, password });
        setSuccessMessage(message);
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : "Failed to activate account.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [confirmPasswordError, password, passwordError, token],
  );

  const visibilityButton = (
    visible: boolean,
    onToggle: () => void,
    label: string,
  ) => (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex shrink-0 rounded-lg text-muted transition-colors hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
      aria-label={label}
    >
      {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
    </button>
  );

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-xl flex-col rounded-lg border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-text">Agent invitation</h1>
            <p className="mt-1 text-sm text-muted">Set your password to activate your agent account.</p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted">Validating invitation...</p>
        ) : validationError ? (
          <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <XCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="font-medium">Invitation cannot be used</p>
              <p className="mt-1 text-sm">{validationError}</p>
            </div>
          </div>
        ) : successMessage ? (
          <div className="flex flex-col gap-5">
            <div className="flex gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
              <div>
                <p className="font-medium">Account activated</p>
                <p className="mt-1 text-sm">{successMessage}</p>
              </div>
            </div>
            <Button type="button" color="primary" size="lg" onClick={() => router.push("/")}>
              Go to sign in
            </Button>
          </div>
        ) : (
          <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="rounded-lg border border-border bg-background/60 p-4">
              <p className="text-sm font-medium text-text">{invitation?.fullName || invitation?.email}</p>
              <p className="mt-1 text-sm text-muted">{invitation?.email}</p>
              {invitation?.serviceArea ? (
                <p className="mt-1 text-sm text-muted">Service area: {invitation.serviceArea}</p>
              ) : null}
            </div>

            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              label="Password"
              placeholder="Create password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={password ? passwordError ?? undefined : undefined}
              iconStart={<Lock className="size-4" aria-hidden />}
              iconEnd={visibilityButton(
                showPassword,
                () => setShowPassword((prev) => !prev),
                showPassword ? "Hide password" : "Show password",
              )}
              isRequired
            />

            <PasswordStrengthIndicator password={password} />

            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              label="Confirm password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              error={confirmPassword ? confirmPasswordError ?? undefined : undefined}
              iconStart={<Lock className="size-4" aria-hidden />}
              iconEnd={visibilityButton(
                showConfirmPassword,
                () => setShowConfirmPassword((prev) => !prev),
                showConfirmPassword ? "Hide password" : "Show password",
              )}
              isRequired
            />

            {submitError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <Button
              type="submit"
              color="primary"
              size="lg"
              fullWidth
              className={cn("font-semibold")}
              isLoading={isSubmitting}
              loadingLabel="Activating account..."
              iconStart={<KeyRound className="size-5" aria-hidden />}
            >
              Activate account
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}
