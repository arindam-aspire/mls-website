"use client";

import { useTranslations } from "next-intl";
import { ProtectedMobileDrawer } from "@/src/layouts/protected-layout/ProtectedMobileDrawer";

export interface ProtectedMobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function ProtectedMobileMenu({ open, onClose }: ProtectedMobileMenuProps) {
  const t = useTranslations("common");

  return (
    <ProtectedMobileDrawer open={open} onClose={onClose} closeLabel={t("closeMenu")} />
  );
}
