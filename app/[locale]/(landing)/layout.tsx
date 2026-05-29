import LandingLayout from "@/src/layouts/landing-layout";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LandingLayout>{children}</LandingLayout>;
}
