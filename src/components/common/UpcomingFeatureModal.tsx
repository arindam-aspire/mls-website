"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
import {
  displayCaptionClasses,
  displayEyebrowClasses,
  displayLeadClasses,
  displayModalTitleClasses,
} from "@/src/lib/typography";
import type { ModalSize } from "@/src/components/ui/modal/types";

/** Stacks above auth and other app modals (`z-50`). */
const elevatedStackClasses = "!z-[100]";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal = (
    <Modal
      open={open}
      onClose={onClose}
      size={size}
      className={elevatedStackClasses}
    >
      <ModalBackdrop className={elevatedStackClasses} />
      <ModalContainer className={elevatedStackClasses}>
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
                <p className={displayEyebrowClasses}>{subtitle}</p>
                <ModalTitle
                  className={cn("text-center", displayModalTitleClasses)}
                >
                  {title}
                </ModalTitle>
                <ModalDescription
                  className={cn("text-center", displayLeadClasses)}
                >
                  {description}
                </ModalDescription>
              </div>

              <div className="flex items-center gap-2 text-muted">
                <Clock className="size-4" aria-hidden />
                <span className={displayCaptionClasses}>Check back soon</span>
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

  if (!mounted) {
    return null;
  }

  return createPortal(modal, document.body);
}
