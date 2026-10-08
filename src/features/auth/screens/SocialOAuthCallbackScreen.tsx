"use client";

import { Button, Skeleton } from "@/src/components/ui";
import { useSocialOAuthCallback } from "../hooks/useSocialOAuthCallback";

export function SocialOAuthCallbackScreen() {
  const { status, title, description, homeLabel, onHome } = useSocialOAuthCallback();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section
        className="rounded-xl border border-secondary/15 bg-surface p-6 sm:p-8"
        aria-busy={status === "loading"}
      >
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-text">{title}</h1>
          <p className="mt-2 text-sm text-muted sm:text-base">{description}</p>
        </div>
        {status === "loading" ? (
          <div className="mt-6 flex flex-col gap-3" aria-hidden>
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="block" className="h-11 w-full rounded-lg" />
          </div>
        ) : (
          <Button type="button" color="primary" className="mt-6 min-h-11" onClick={onHome}>
            {homeLabel}
          </Button>
        )}
      </section>
    </main>
  );
}
