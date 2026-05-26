import PublicLayout from "@/src/layouts/public-layout";

export default function PropertyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicLayout>{children}</PublicLayout>
  );
}
