"use client";

import { CopyLinkBar } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, bodyTextClasses } from "@/src/lib/typography";
import { CheckCircle2 } from "lucide-react";

export type InviteAgentReadyPanelProps = {
  readyTitle: string;
  generatedMessage: string;
  shareHint: string;
  linkLabel: string;
  inviteLink: string;
  copyLinkLabel: string;
  onCopyLink: () => void;
};

export function InviteAgentReadyPanel({
  readyTitle,
  generatedMessage,
  shareHint,
  linkLabel,
  inviteLink,
  copyLinkLabel,
  onCopyLink,
}: InviteAgentReadyPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center select-none py-2">
      {/* Success badge with glowing backdrop */}
      <div className="relative flex items-center justify-center">
        <div className="absolute size-12 rounded-full bg-success/20 animate-ping opacity-60" />
        <div className="absolute size-16 rounded-full bg-success/5 animate-pulse" />
        <div className="relative flex size-14 items-center justify-center rounded-full bg-success/10 border border-success/20 shadow-sm text-success">
          <CheckCircle2 className="size-7" aria-hidden />
        </div>
      </div>

      <h3 className={cn("mt-5 text-lg font-bold text-text", bodyLargeTextClasses)}>
        {readyTitle}
      </h3>

      <p className={cn("mt-1 text-sm text-muted max-w-sm", bodyTextClasses)}>
        {generatedMessage}
      </p>

      {/* Spacers and Copy Link Bar */}
      <div className="mt-6 w-full text-start">
        <CopyLinkBar
          label={linkLabel}
          value={inviteLink}
          copyLabel={copyLinkLabel}
          onCopy={onCopyLink}
        />
      </div>

      <p className={cn("mt-3 text-xs text-muted max-w-[320px]", bodyTextClasses)}>
        {shareHint}
      </p>
    </div>
  );
}
