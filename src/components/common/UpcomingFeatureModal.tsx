"use client";

import type { ReactNode } from "react";
import { Clock, Hammer } from "lucide-react";
import { cn } from "@/src/lib/cn";
import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalPanel,
  ModalTitle,
} from "@/src/components/ui/modal";
import { Button } from "@/src/components/ui/button";
import type { ModalSize } from "@/src/components/ui/modal/types";

export interface UpcomingFeatureModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  description?: string;
  dismissLabel?: string;
  icon?: ReactNode;
  size?: ModalSize;
  showCloseButton?: boolean;
}

export function UpcomingFeatureModal({
  open,
  onClose,
  title = "Coming Soon",
  subtitle = "Under Development",
  description = "We're working hard to bring this feature to you. Stay tuned for updates!",
  dismissLabel = "Got it",
  icon,
  size = "sm",
  showCloseButton = true,
}: UpcomingFeatureModalProps) {
  return (
    <Modal open={open} onClose={onClose} size={size}>
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size={size}>
          {showCloseButton && <ModalCloseButton />}

          <ModalContent className="px-4 sm:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <span
                className={cn(
                  "inline-flex size-14 items-center justify-center rounded-full",
                  "border border-dashed border-secondary/30 bg-primary-light text-primary",
                )}
              >
                {icon ?? <Hammer className="size-7" aria-hidden />}
              </span>

              <div className="space-y-1.5">
                <p className="text-xs font-bold tracking-[0.2em] text-secondary-dark uppercase">
                  {subtitle}
                </p>
                <ModalTitle className="text-center font-serif text-2xl sm:text-3xl">
                  {title}
                </ModalTitle>
                <ModalDescription className="text-center text-base leading-relaxed">
                  {description}
                </ModalDescription>
              </div>

              <div className="flex items-center gap-2 text-muted">
                <Clock className="size-4" aria-hidden />
                <span className="text-xs tracking-wide sm:text-sm">
                  Check back soon
                </span>
              </div>
            </div>
          </ModalContent>

          <ModalFooter className="!flex-row !justify-center border-t-0">
            <Button
              type="button"
              color="primary"
              variant="solid"
              size="md"
              className="min-w-28 rounded-lg"
              onClick={onClose}
            >
              {dismissLabel}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
