"use client";

import { use } from "react";
import LoadingScreen from "@/src/features/loading/screens";
import { LeadDetailsScreen } from "@/src/features/leads/screens/LeadDetailsScreen";
import { usePageTitle } from "@/src/hooks/usePageTitle";
import { useAuthorize } from "@/src/lib/auth/authorize";

type LeadDetailsPageProps = {
  params: Promise<{ leadId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default function LeadDetailsPage({
  params,
  searchParams,
}: LeadDetailsPageProps) {
  const { leadId } = use(params);
  const { tab } = use(searchParams);

  usePageTitle("leadDetails");
  const { user, isLoadingUser } = useAuthorize("LEADS");

  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <LeadDetailsScreen leadId={leadId} initialTab={tab ?? null} />;
}
