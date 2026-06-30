"use client";

import {
  Bell,
  Building2,
  CheckCircle2,
  FileClock,
  ListChecks,
  Plus,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { UserRole } from "@/src/lib/auth/roles";
import { useDashboardScreen } from "../hooks/useDashboardScreen";

type KpiCardProps = {
  label: string;
  value: number;
  helper: string;
  icon: typeof Building2;
  tone: "blue" | "green" | "amber" | "slate";
};

const toneClasses: Record<KpiCardProps["tone"], string> = {
  blue: "bg-sky-50 text-sky-700 ring-sky-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  slate: "bg-slate-50 text-slate-700 ring-slate-100",
};

function KpiCard({ label, value, helper, icon: Icon, tone }: KpiCardProps) {
  return (
    <section className="rounded-lg border border-secondary/15 bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold text-text">{value}</p>
        </div>
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg ring-1",
            toneClasses[tone],
          )}
          aria-hidden
        >
          <Icon className="size-5" strokeWidth={1.8} />
        </span>
      </div>
      <p className="mt-4 text-sm text-muted">{helper}</p>
    </section>
  );
}

function LoadingDashboard() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-lg bg-surface" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-36 animate-pulse rounded-lg bg-surface" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,0.8fr)]">
        <div className="h-80 animate-pulse rounded-lg bg-surface" />
        <div className="h-80 animate-pulse rounded-lg bg-surface" />
      </div>
    </div>
  );
}

export default function DashboardScreen() {
  const locale = useLocale();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const {
    isLoading,
    hasError,
    agencyCount,
    agencies,
    pendingSubmissions,
    pendingSubmissionCount,
    activePropertyCount,
    unreadNotificationCount,
    canReviewSubmissions,
    isAgent,
  } = useDashboardScreen();

  const roles = new Set(user?.roles?.map((role) => role.name) ?? []);
  const isSuperAdmin = roles.has(UserRole.SUPER_ADMIN);
  const isAgentDashboard = isAgent && !canReviewSubmissions;
  const displayName = user?.full_name?.trim() || user?.email || "User";

  const goTo = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <LoadingDashboard />
      </main>
    );
  }

  return (
    <main className="container mx-auto space-y-6 px-4 py-8">
      <section className="rounded-lg border border-secondary/15 bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
              {isSuperAdmin ? "Platform Control" : "Workspace"}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-text">Dashboard</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              Welcome, {displayName}.{" "}
              {isAgentDashboard
                ? "Review assigned listings and operational notifications from one place."
                : "Review platform activity, pending property approvals, agency coverage, and operational notifications from one place."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              color="primary"
              iconStart={<ListChecks className="size-4" aria-hidden />}
              onClick={() => goTo("/manage-listings")}
            >
              {isAgentDashboard ? "View Assigned Listings" : "Review Listings"}
            </Button>
            {!isAgentDashboard ? (
              <Button
                type="button"
                variant="outline"
                color="inherit"
                iconStart={<Plus className="size-4" aria-hidden />}
                onClick={() => goTo("/property-create")}
              >
                Add Property
              </Button>
            ) : null}
          </div>
        </div>
        {hasError ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Some dashboard data could not be loaded. Available sections are still shown.
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard metrics">
        <KpiCard
          label={isAgentDashboard ? "Assigned Listings" : "Agencies"}
          value={isAgentDashboard ? activePropertyCount : agencyCount}
          helper={
            isAgentDashboard
              ? "Listings currently assigned to your account."
              : "Agency records available to this workspace."
          }
          icon={Building2}
          tone="blue"
        />
        {!isAgentDashboard ? (
          <>
            <KpiCard
              label="Pending Reviews"
              value={pendingSubmissionCount}
              helper="Property submissions waiting for Super Admin approval."
              icon={FileClock}
              tone="amber"
            />
            <KpiCard
              label="Visible Listings"
              value={activePropertyCount}
              helper="Public listing count currently returned by marketplace search."
              icon={CheckCircle2}
              tone="green"
            />
          </>
        ) : null}
        <KpiCard
          label="Unread Alerts"
          value={unreadNotificationCount}
          helper="Unread operational notifications requiring attention."
          icon={Bell}
          tone="slate"
        />
      </section>

      {isAgentDashboard ? (
        <section className="rounded-lg border border-secondary/15 bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">Assigned Listings</h2>
              <p className="mt-1 text-sm text-muted">
                Continue from your agency-assigned property queue.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              color="inherit"
              onClick={() => goTo("/manage-listings")}
            >
              Open Manage Listings
            </Button>
          </div>
        </section>
      ) : null}

      {canReviewSubmissions ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,0.8fr)]">
        <div className="rounded-lg border border-secondary/15 bg-surface shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-text">Pending Property Reviews</h2>
              <p className="text-sm text-muted">Latest submissions awaiting approval.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              color="inherit"
              size="sm"
              onClick={() => goTo("/manage-listings")}
            >
              View All
            </Button>
          </div>
          <div className="divide-y divide-secondary/10">
            {pendingSubmissions.length > 0 ? (
              pendingSubmissions.map((item) => (
                <article key={item.submission_id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-text">{item.property_title}</h3>
                    <p className="mt-1 text-xs text-muted">
                      Submitted by {item.submitted_by_name || "Unknown"} · Step {item.current_step}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    Pending
                  </span>
                </article>
              ))
            ) : (
              <p className="px-5 py-10 text-center text-sm text-muted">
                No pending property reviews.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-secondary/15 bg-surface shadow-sm">
          <div className="border-b border-secondary/10 px-5 py-4">
            <h2 className="text-lg font-bold text-text">Agency Snapshot</h2>
            <p className="text-sm text-muted">Recently available agencies.</p>
          </div>
          <div className="divide-y divide-secondary/10">
            {agencies.slice(0, 5).map((agency) => (
              <article key={agency.id} className="px-5 py-4">
                <h3 className="truncate text-sm font-semibold text-text">{agency.agency_name}</h3>
                <p className="mt-1 truncate text-xs text-muted">{agency.email || agency.phone || "No contact"}</p>
              </article>
            ))}
            {agencies.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted">No agencies found.</p>
            ) : null}
          </div>
        </div>
        </section>
      ) : null}
    </main>
  );
}
