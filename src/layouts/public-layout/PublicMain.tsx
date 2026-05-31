"use client";

import { usePathname } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";

const PROPERTY_LIST_PATH = "/property-list";

export function PublicMain({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPropertyListScreen = pathname === PROPERTY_LIST_PATH;

  return (
    <main
      className={cn(
        "flex flex-1 flex-col overflow-visible px-6 py-4",
        "max-md:pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))]",
        isPropertyListScreen && "pt-0 sm:pb-6",
      )}
    >
      {isPropertyListScreen ? (
        children
      ) : (
        <div className="container mx-auto w-full">{children}</div>
      )}
    </main>
  );
}
