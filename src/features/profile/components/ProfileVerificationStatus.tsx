"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";

type ProfileVerificationStatusProps = {
  isVerified: boolean;
  verifiedLabel: string;
  notVerifiedLabel: string;
  verifyLabel?: string;
  verifyLoadingLabel?: string;
  onVerify?: () => void;
  isVerifying?: boolean;
  verifyDisabled?: boolean;
  className?: string;
};

export function ProfileVerificationStatus({
  isVerified,
  verifiedLabel,
  notVerifiedLabel,
  verifyLabel,
  verifyLoadingLabel,
  onVerify,
  isVerifying = false,
  verifyDisabled = false,
  className,
}: ProfileVerificationStatusProps) {
  const showVerify = !isVerified && Boolean(verifyLabel && onVerify);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium",
          isVerified ? "bg-success/15 text-success" : "bg-danger/10 text-danger",
        )}
      >
        {isVerified ? (
          <CheckCircle className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <XCircle className="size-3.5 shrink-0" aria-hidden />
        )}
        {isVerified ? verifiedLabel : notVerifiedLabel}
      </span>
      {showVerify ? (
        <Button
          type="button"
          color="primary"
          variant="outline"
          size="sm"
          className="min-h-11 shrink-0 rounded-lg"
          onClick={onVerify}
          disabled={verifyDisabled}
          isLoading={isVerifying}
          loadingLabel={verifyLoadingLabel}
        >
          {verifyLabel}
        </Button>
      ) : null}
    </div>
  );
}

export type { ProfileVerificationStatusProps };
