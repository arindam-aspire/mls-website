"use client";

import {
  Bell,
  Building2,
  CheckCircle2,
  FileClock,
  ListChecks,
  Plus,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { UserRole } from "@/src/lib/auth/roles";
import { DashboardHealthAlerts } from "../components/DashboardHealthAlerts";
import { DashboardKpiCards } from "../components/DashboardKpiCards";
import { DashboardLeadSourceChart } from "../components/DashboardLeadSourceChart";
import { DashboardRecentActivity } from "../components/DashboardRecentActivity";
import { DashboardScreenSkeleton } from "../components/DashboardScreenSkeleton";
import { DashboardTrendChart } from "../components/DashboardTrendChart";
import { useDashboardScreen } from "../hooks/useDashboardScreen";

type KpiCardProps = {
  label: string;
  value: number;
  helper: string;
  icon: typeof Building2;
  tone: "blue" | "green" | "amber" | "slate";
};

const toneClasses: Record<KpiCardProps["tone"], string> = {
  blue: "bg-info/15 text-info ring-info/15",
  green: "bg-success/15 text-success ring-success/15",
  amber: "bg-tertiary/20 text-tertiary-dark ring-tertiary/20",
  slate: "bg-secondary-light text-secondary-dark ring-secondary/15",
};

function KpiCard({ label, value, helper, icon: Icon, tone }: KpiCardProps) {
  return (
    <section className="rounded-xl border border-secondary/15 bg-surface p-5 shadow-sm">
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

export default function DashboardScreen() {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const {
    isLoading,
    hasError,
    isSummaryDashboard,
    summary,
    kpiMetrics,
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
  const displayName = user?.full_name?.trim() || user?.email || t("userFallback");

  const goTo = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <DashboardScreenSkeleton />
      </main>
    );
  }

  if (isSummaryDashboard) {
    return (
      <main className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <Card className="rounded-xl border border-secondary/10 shadow-none">
          <CardContent className="p-4 sm:p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
              {t("hero.platformControl")}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              {t("hero.adminWelcome", { name: displayName })}
            </p>
            {hasError ? (
              <p
                className="mt-4 rounded-lg border border-danger/25 bg-danger/5 px-4 py-3 text-sm text-danger"
                role="alert"
              >
                {t("error.description")}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <DashboardKpiCards
          metrics={kpiMetrics}
          locale={locale}
          sectionAriaLabel={t("kpi.ariaLabel")}
          trendAriaLabel={(percentage) =>
            percentage >= 0
              ? t("kpi.trendIncrease", { percentage: Math.abs(percentage) })
              : t("kpi.trendDecrease", { percentage: Math.abs(percentage) })
          }
        />

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DashboardTrendChart
            title={t("charts.userGrowth")}
            labels={summary?.monthLabels ?? []}
            values={summary?.userGrowthSeries ?? []}
            emptyTitle={t("empty.chartTitle")}
            emptyDescription={t("empty.chartDescription")}
            locale={locale}
            color="primary"
          />
          <DashboardTrendChart
            title={t("charts.listingGrowth")}
            labels={summary?.monthLabels ?? []}
            values={summary?.listingGrowthSeries ?? []}
            emptyTitle={t("empty.chartTitle")}
            emptyDescription={t("empty.chartDescription")}
            locale={locale}
            color="secondary"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <DashboardTrendChart
            title={t("charts.leadGrowth")}
            labels={summary?.monthLabels ?? []}
            values={summary?.leadGrowthSeries ?? []}
            emptyTitle={t("empty.chartTitle")}
            emptyDescription={t("empty.chartDescription")}
            locale={locale}
            color="info"
          />
          <DashboardLeadSourceChart
            title={t("charts.leadSource")}
            labels={summary?.leadSourceLabels ?? []}
            values={summary?.leadSourceValues ?? []}
            emptyTitle={t("empty.leadSourceTitle")}
            emptyDescription={t("empty.leadSourceDescription")}
            locale={locale}
          />
          <DashboardRecentActivity
            title={t("recentActivity.title")}
            activities={summary?.recentActivities ?? []}
            emptyTitle={t("empty.activityTitle")}
            emptyDescription={t("empty.activityDescription")}
          />
        </section>

        <DashboardHealthAlerts
          title={t("healthAlerts.title")}
          alerts={summary?.healthAlerts ?? []}
          emptyTitle={t("empty.alertsTitle")}
          emptyDescription={t("empty.alertsDescription")}
          severityLabels={{
            warning: t("healthAlerts.severity.warning"),
            info: t("healthAlerts.severity.info"),
            error: t("healthAlerts.severity.error"),
            success: t("healthAlerts.severity.success"),
          }}
        />
      </main>
    );
  }

  return (
    <main className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <section className="rounded-xl border border-secondary/15 bg-surface p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-dark">
              {isSuperAdmin ? t("hero.platformControl") : t("hero.workspace")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-text">{t("title")}</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted">
              {isAgentDashboard
                ? t("hero.agentWelcome", { name: displayName })
                : t("hero.workspaceWelcome", { name: displayName })}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              color="primary"
              iconStart={<ListChecks className="size-4" aria-hidden />}
              onClick={() => goTo("/manage-listings")}
            >
              {isAgentDashboard ? t("actions.viewAssignedListings") : t("actions.reviewListings")}
            </Button>
            {!isAgentDashboard ? (
              <Button
                type="button"
                variant="outline"
                color="inherit"
                iconStart={<Plus className="size-4" aria-hidden />}
                onClick={() => goTo("/property-create")}
              >
                {t("actions.addProperty")}
              </Button>
            ) : null}
          </div>
        </div>
        {hasError ? (
          <p className="mt-4 rounded-lg border border-tertiary/40 bg-tertiary/10 px-4 py-3 text-sm text-text">
            {t("error.partialDescription")}
          </p>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label={t("kpi.ariaLabel")}>
        <KpiCard
          label={isAgentDashboard ? t("legacy.assignedListings") : t("legacy.agencies")}
          value={isAgentDashboard ? activePropertyCount : agencyCount}
          helper={
            isAgentDashboard
              ? t("legacy.assignedListingsHelper")
              : t("legacy.agenciesHelper")
          }
          icon={Building2}
          tone="blue"
        />
        {!isAgentDashboard ? (
          <>
            <KpiCard
              label={t("legacy.pendingReviews")}
              value={pendingSubmissionCount}
              helper={t("legacy.pendingReviewsHelper")}
              icon={FileClock}
              tone="amber"
            />
            <KpiCard
              label={t("legacy.visibleListings")}
              value={activePropertyCount}
              helper={t("legacy.visibleListingsHelper")}
              icon={CheckCircle2}
              tone="green"
            />
          </>
        ) : null}
        <KpiCard
          label={t("legacy.unreadAlerts")}
          value={unreadNotificationCount}
          helper={t("legacy.unreadAlertsHelper")}
          icon={Bell}
          tone="slate"
        />
      </section>

      {isAgentDashboard ? (
        <section className="rounded-xl border border-secondary/15 bg-surface p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">{t("legacy.assignedListings")}</h2>
              <p className="mt-1 text-sm text-muted">
                {t("legacy.assignedListingsDescription")}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              color="inherit"
              onClick={() => goTo("/manage-listings")}
            >
              {t("actions.openManageListings")}
            </Button>
          </div>
        </section>
      ) : null}

      {canReviewSubmissions ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,0.8fr)]">
        <div className="rounded-xl border border-secondary/15 bg-surface shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-secondary/10 px-5 py-4">
            <div>
              <h2 className="text-lg font-bold text-text">{t("legacy.pendingPropertyReviews")}</h2>
              <p className="text-sm text-muted">{t("legacy.pendingPropertyReviewsDescription")}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              color="inherit"
              size="sm"
              onClick={() => goTo("/manage-listings")}
            >
              {t("actions.viewAll")}
            </Button>
          </div>
          <div className="divide-y divide-secondary/10">
            {pendingSubmissions.length > 0 ? (
              pendingSubmissions.map((item) => (
                <article key={item.submission_id} className="flex items-center justify-between gap-4 px-5 py-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-text">{item.property_title}</h3>
                    <p className="mt-1 text-xs text-muted">
                      {t("legacy.submissionMeta", {
                        name: item.submitted_by_name || t("unknown"),
                        step: item.current_step,
                      })}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-tertiary/20 px-3 py-1 text-xs font-semibold text-tertiary-dark">
                    {t("legacy.pending")}
                  </span>
                </article>
              ))
            ) : (
              <p className="px-5 py-10 text-center text-sm text-muted">
                {t("empty.pendingReviews")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-secondary/15 bg-surface shadow-sm">
          <div className="border-b border-secondary/10 px-5 py-4">
            <h2 className="text-lg font-bold text-text">{t("legacy.agencySnapshot")}</h2>
            <p className="text-sm text-muted">{t("legacy.agencySnapshotDescription")}</p>
          </div>
          <div className="divide-y divide-secondary/10">
            {agencies.slice(0, 5).map((agency) => (
              <article key={agency.id} className="px-5 py-4">
                <h3 className="truncate text-sm font-semibold text-text">{agency.agency_name}</h3>
                <p className="mt-1 truncate text-xs text-muted">{agency.email || agency.phone || t("legacy.noContact")}</p>
              </article>
            ))}
            {agencies.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-muted">{t("empty.agencies")}</p>
            ) : null}
          </div>
        </div>
        </section>
      ) : null}
    </main>
  );
}
