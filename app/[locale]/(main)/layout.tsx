import LoadingScreen from "@/src/features/loading/screens";
import ProtectedLayout from "@/src/layouts/protected-layout";
import { useAuthorize } from "@/src/lib/auth/authorize";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { user, isLoadingUser } = useAuthorize("SAVED_SEARCHES");
  if (!isLoadingUser && !user) return <LoadingScreen />;

  return <ProtectedLayout>{children}</ProtectedLayout>;
}
