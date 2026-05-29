"use client";

import { usePathname } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";

export function LandingMain({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLandingScreen = pathname === "/";

  return (
    <main
      className={cn(
        "flex min-h-0 flex-1 flex-col px-6 py-4",
        isLandingScreen && "-mt-16 sm:-mt-20 !px-0 !py-0",
      )}
    >
      {children}
    </main>
  );
}
