import ProtectedLayout from "@/src/layouts/protected-layout";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout>
      {children}
    </ProtectedLayout>
  );
}
