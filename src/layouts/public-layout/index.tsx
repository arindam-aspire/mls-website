import { Suspense } from "react";
import { AuthModal } from "@/src/features/auth/components/AuthModal";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";
import { PublicMain } from "./PublicMain";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <PublicHeader />
      <Suspense fallback={null}>
        <AuthModal />
      </Suspense>
      <PublicMain>{children}</PublicMain>
      <PublicFooter />
    </div>
  );
}
