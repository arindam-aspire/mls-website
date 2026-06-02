import type { ReactNode } from "react";
import { ProtectedDrawer } from "@/src/layouts/protected-layout/ProtectedDrawer";
import { ProtectedFooter } from "@/src/layouts/protected-layout/ProtectedFooter";
import { ProtectedHeader } from "@/src/layouts/protected-layout/ProtectedHeader";
import { ProtectedMain } from "@/src/layouts/protected-layout/ProtectedMain";
import { ProtectedMobileMenu } from "@/src/layouts/protected-layout/ProtectedMobileMenu";
import { ProtectedSidebar } from "@/src/layouts/protected-layout/ProtectedSidebar";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="relative flex min-h-dvh w-full bg-page text-text">
      <ProtectedSidebar />
      <ProtectedDrawer />

      <div className="flex min-w-0 flex-1 flex-col">
        <ProtectedHeader />
        <ProtectedMobileMenu />
        <ProtectedMain>{children}</ProtectedMain>
        <ProtectedFooter />
      </div>
    </div>
  );
}
