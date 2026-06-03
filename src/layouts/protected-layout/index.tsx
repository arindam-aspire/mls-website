import type { ReactNode } from "react";
import { ProtectedBottomTabBar } from "@/src/layouts/protected-layout/ProtectedBottomTabBar";
import { ProtectedFooter } from "@/src/layouts/protected-layout/ProtectedFooter";
import { ProtectedHeader } from "@/src/layouts/protected-layout/ProtectedHeader";
import { ProtectedMain } from "@/src/layouts/protected-layout/ProtectedMain";
import { ProtectedSidebar } from "@/src/layouts/protected-layout/ProtectedSidebar";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="relative flex min-h-dvh w-full items-start bg-page text-text">
      <ProtectedSidebar />

      <div className="relative z-0 flex min-h-dvh min-w-0 flex-1 flex-col">
        <ProtectedHeader />
        <ProtectedMain>{children}</ProtectedMain>
        <ProtectedFooter />
      </div>

      <ProtectedBottomTabBar />
    </div>
  );
}
