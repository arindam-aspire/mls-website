"use client";

import { Bell } from "lucide-react";
import { Popover, PopoverButton } from "@/src/components/ui/popover";
import type { ButtonSizeTier } from "@/src/components/ui/responsiveSizes";
import {
  buttonIconSizeClasses,
  iconButtonSizeClasses,
} from "@/src/components/ui/responsiveSizes";
import { headerOverHeroIconClass } from "@/src/layouts/public-layout/PublicNotificationsButton";
import {
  headerIconStrokeWidth,
  headerNotificationCountBadgeClass,
  headerPopoverTriggerClass,
} from "@/src/layouts/shared/headerIconButtonStyles";
import { notificationsIndicatorClass } from "@/src/layouts/shared/notificationsButtonStyles";
import { cn } from "@/src/lib/cn";
import { NotificationsPopoverPanel } from "../components/NotificationsPopoverPanel";
import { useNotificationsPopover } from "../hooks/useNotificationsPopover";

type NotificationsPopoverProps = {
  className?: string;
  enabled?: boolean;
  hasUnread?: boolean;
  /** Landing header: translucent controls over hero image. */
  overHero?: boolean;
  /** Icon button size tier for the trigger. Protected header uses `sm`. */
  controlSize?: ButtonSizeTier;
  /** When set with `controlSize="sm"`, shows a numeric badge instead of a dot. */
  unreadCount?: number;
};

const popoverTriggerSizeClasses: Record<ButtonSizeTier, string> = {
  xs: cn(
    "!inline-flex !shrink-0 !rounded-full !border !border-secondary/15",
    "!bg-surface !p-0 !shadow-none",
    iconButtonSizeClasses.xs,
  ),
  sm: headerPopoverTriggerClass,
  md: cn(
    "!inline-flex !size-9 !min-h-9 !min-w-9 !shrink-0 !rounded-full !border !border-secondary/15",
    "!bg-surface !p-0 !shadow-none sm:!size-11 sm:!min-h-11 sm:!min-w-11",
  ),
  lg: cn(
    "!inline-flex !shrink-0 !rounded-full !border !border-secondary/15",
    "!bg-surface !p-0 !shadow-none",
    iconButtonSizeClasses.lg,
  ),
};

export function NotificationsPopover({
  className,
  enabled = true,
  hasUnread = false,
  overHero = false,
  controlSize = "md",
  unreadCount,
}: NotificationsPopoverProps) {
  const popover = useNotificationsPopover({ enabled, hasUnread });
  const showCountBadge =
    controlSize === "sm" && unreadCount != null && unreadCount > 0;
  const badgeLabel =
    unreadCount != null && unreadCount > 99 ? "99+" : String(unreadCount ?? "");

  return (
    <Popover className={cn("relative inline-flex shrink-0", className)}>
      <span className="relative inline-flex shrink-0">
        <PopoverButton
          type="button"
          aria-label={popover.notificationsAriaLabel}
          onClick={popover.onOpen}
          className={cn(
            popoverTriggerSizeClasses[controlSize],
            "hover:!bg-page data-active:!bg-page",
            "focus-visible:ring-2 focus-visible:ring-secondary/40",
            overHero && headerOverHeroIconClass,
          )}
        >
          <Bell
            className={cn(buttonIconSizeClasses[controlSize], "shrink-0 text-current")}
            strokeWidth={controlSize === "sm" ? headerIconStrokeWidth : 2}
            aria-hidden
          />
        </PopoverButton>

        {showCountBadge ? (
          <span className={headerNotificationCountBadgeClass} aria-hidden>
            {badgeLabel}
          </span>
        ) : hasUnread ? (
          <span className={notificationsIndicatorClass(overHero)} aria-hidden />
        ) : null}
      </span>

      <NotificationsPopoverPanel
        popoverTitle={popover.popoverTitle}
        markAllAsReadLabel={popover.markAllAsReadLabel}
        listAriaLabel={popover.listAriaLabel}
        emptyTitle={popover.emptyTitle}
        emptyDescription={popover.emptyDescription}
        seeAllNotificationsLabel={popover.seeAllNotificationsLabel}
        loadErrorMessage={popover.loadErrorMessage}
        items={popover.items}
        hasUnread={hasUnread}
        showMarkAllAsRead={popover.showMarkAllAsRead}
        isMarkingAllRead={popover.isMarkingAllRead}
        isLoading={popover.isLoading}
        isError={popover.isError}
        isEmpty={popover.isEmpty}
        onMarkAllAsRead={popover.onMarkAllAsRead}
        onSelectNotification={popover.onSelectNotification}
        getRelativeTime={popover.getRelativeTime}
      />
    </Popover>
  );
}
