import { redirect } from "next/navigation";

type AgentPasswordSetupRedirectPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AgentPasswordSetupRedirectPage({
  searchParams,
}: AgentPasswordSetupRedirectPageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";
  const query = token ? `?token=${encodeURIComponent(token)}` : "";

  redirect(`/en/agent-password-setup${query}`);
}
