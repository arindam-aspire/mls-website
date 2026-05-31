import { Suspense } from "react";
import { AuthModal } from "@/src/features/auth/components/AuthModal";
import { LandingFooter } from "./LandingFooter";
import { LandingHeader } from "./LandingHeader";
import { LandingMain } from "./LandingMain";
import { LandingBottomTabBar } from "./LandingBottomTabBar";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <LandingHeader />
      <Suspense fallback={null}>
        <AuthModal />
      </Suspense>
      <LandingMain>{children}</LandingMain>
      <LandingFooter />
      <LandingBottomTabBar />
    </div>
  );
}
