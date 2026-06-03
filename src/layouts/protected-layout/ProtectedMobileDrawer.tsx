"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import { X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import { ProtectedMobileDrawerSystemOptions } from "@/src/layouts/protected-layout/ProtectedMobileDrawerSystemOptions";
import { Link } from "@/src/i18n/navigation";
import { isRtlLocale } from "@/src/i18n/routing";
import { cn } from "@/src/lib/cn";
import {
  protectedDrawerCloseButtonClass,
  protectedDrawerHeaderBarClass,
  protectedDrawerLogoImageClass,
  protectedDrawerLogoLinkClass,
  protectedDrawerSectionsContainerClass,
  protectedMobileHeaderContainerClass,
  protectedMobileHeaderIconClass,
} from "@/src/layouts/protected-layout/protectedMobileHeaderStyles";

const DRAWER_DURATION = "duration-700";

const drawerBackdropClass = cn(
  "fixed inset-0 bg-black/40 transition-opacity ease-out",
  DRAWER_DURATION,
  "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
);

function drawerPanelClass(isRtl: boolean) {
  return cn(
    "pointer-events-auto relative flex h-dvh w-[calc(85vw-1rem)] max-w-[36rem] flex-col overflow-hidden bg-page text-text shadow-xl outline-none",
    "transform transition ease-in-out",
    DRAWER_DURATION,
    isRtl ? "data-closed:translate-x-full" : "data-closed:-translate-x-full",
  );
}

export interface ProtectedMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible label for the close control (i18n). */
  closeLabel: string;
  className?: string;
}

export function ProtectedMobileDrawer({
  open,
  onClose,
  closeLabel,
  className,
}: ProtectedMobileDrawerProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      transition
      className={cn("relative z-[120] md:hidden", className)}
    >
      <DialogBackdrop transition className={drawerBackdropClass} />
      <div className="fixed inset-0 z-[120] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 start-0 flex max-w-full">
            <DialogPanel transition className={drawerPanelClass(isRtl)}>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-page">
                <div className="sticky top-0 z-10 shrink-0 bg-primary">
                  <div
                    className={cn(
                      protectedMobileHeaderContainerClass,
                      protectedDrawerHeaderBarClass,
                    )}
                  >
                    <Link
                      href="/"
                      onClick={onClose}
                      className={protectedDrawerLogoLinkClass}
                    >
                      <Image
                        src={mlsLogoDark}
                        alt={t("brand")}
                        className={protectedDrawerLogoImageClass}
                        priority
                      />
                    </Link>
                    <button
                      type="button"
                      aria-label={closeLabel}
                      className={protectedDrawerCloseButtonClass}
                      onClick={onClose}
                    >
                      <X
                        className={protectedMobileHeaderIconClass}
                        aria-hidden
                      />
                    </button>
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col">
                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
                    <div className={protectedDrawerSectionsContainerClass}>
                      <ProtectedMobileDrawerSystemOptions />
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
