import { redirect } from "next/navigation";

type AgencyPasswordSetupRedirectPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function AgencyPasswordSetupRedirectPage({
  searchParams,
}: AgencyPasswordSetupRedirectPageProps) {
  const { token } = await searchParams;
  const query = token ? `?token=${encodeURIComponent(token)}` : "";

  redirect(`/en/agency-password-setup${query}`);
}
