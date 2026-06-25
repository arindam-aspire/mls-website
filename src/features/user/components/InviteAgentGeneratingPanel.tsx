"use client";

import { Loader2 } from "lucide-react";

export type InviteAgentGeneratingPanelProps = {
  generatingMessage: string;
  generatingHint: string;
};

export function InviteAgentGeneratingPanel({
  generatingMessage,
  generatingHint,
}: InviteAgentGeneratingPanelProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-8 text-center select-none"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center">
        {/* Glowing backdrop animations */}
        <div className="absolute size-12 rounded-full bg-primary/10 animate-ping" />
        <div className="absolute size-16 rounded-full bg-primary/5 animate-pulse" />

        {/* Inner core spinner */}
        <div className="relative flex size-14 items-center justify-center rounded-full border border-secondary/10 bg-surface shadow-sm">
          <Loader2
            className="size-6 animate-spin text-primary"
            aria-hidden
          />
        </div>
      </div>

      <p className="mt-5 text-base font-semibold text-text" role="status">
        {generatingMessage}
      </p>
      <p className="mt-1.5 text-sm text-muted max-w-[280px]">
        {generatingHint}
      </p>
    </div>
  );
}
