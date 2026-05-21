import PublicLayout from "@/src/layouts/public-layout";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
    <PublicLayout> {children} </PublicLayout>
  );
}
