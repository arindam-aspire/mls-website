import { redirect } from "next/navigation";

type AgencyInvitationRedirectPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function AgencyInvitationRedirectPage({
  searchParams,
}: AgencyInvitationRedirectPageProps) {
  const { token } = await searchParams;
  const query = token ? `?token=${encodeURIComponent(token)}` : "";

  redirect(`/en/agency-invitation${query}`);
}
