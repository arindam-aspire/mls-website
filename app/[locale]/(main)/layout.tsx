import ProtectedLayout from "@/src/layouts/protected-layout";
//import { tokenStore } from "@/src/apis/core/token.store";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const hasTokens = tokenStore.hasAuthCredentials();
  // if (!hasTokens) {
  //   return <div>No tokens</div>;
  // }

  return <ProtectedLayout>{children}</ProtectedLayout>;
}
