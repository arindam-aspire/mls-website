import { redirect } from "next/navigation";

type AgentInviteRedirectPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function AgentInviteRedirectPage({
  searchParams,
}: AgentInviteRedirectPageProps) {
  const { token } = await searchParams;
  const query = token ? `?token=${encodeURIComponent(token)}` : "";

  redirect(`/en/agent-invite${query}`);
}
