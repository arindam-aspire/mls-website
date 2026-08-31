"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Link as UiLink } from "@/src/components/ui/link";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@/src/components/ui/popover";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import {
  useProtectedProfileMenu,
  useProtectedProfileMenuItem,
  type ProtectedProfileMenuAccountGroupItem,
} from "@/src/layouts/protected-layout/hooks/useProtectedProfileMenu";
import { protectedHeaderControlDividerClass } from "@/src/layouts/protected-layout/protectedMobileHeaderStyles";
import { isRtlLocale } from "@/src/i18n/routing";
import { cn } from "@/src/lib/cn";
import { profileEmailClasses, profileNameClasses } from "@/src/lib/typography";
import { useLocale } from "next-intl";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  FilePenLine,
  Heart,
  List,
  LogOut,
  Search,
  Send,
  User,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const MENU_ICONS = {
  profile: User,
  myListings: List,
  manageListings: List,
  draftListings: FilePenLine,
  myFavourites: Heart,
  mySavedSearches: Search,
  myRecentlyViewed: Eye,
  myInquiries: Send,
} as const;

export interface ProtectedProfileMenuProps {
  user: LoggedInUser;
  className?: string;
}

export function ProtectedProfileMenu({ user, className }: ProtectedProfileMenuProps) {
  const {
    t,
    roleLabel,
    menuEntries,
    menuAriaLabel,
    showLogoutConfirm,
    isLoggingOut,
    openLogoutConfirm,
    closeLogoutConfirm,
    confirmLogout,
    router,
  } = useProtectedProfileMenu(user);

  return (
    <>
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 sm:gap-3",
          className,
        )}
      >
        <span
          className={cn("hidden md:block", protectedHeaderControlDividerClass)}
          aria-hidden
        />

        <PopoverGroup>
          <Popover className="relative flex items-center">
            <PopoverButton
              className={cn(
                "!gap-2 !rounded-lg !border-0 !bg-transparent !p-0 !shadow-none",
                "hover:!bg-transparent data-active:!bg-transparent",
                "focus-visible:ring-2 focus-visible:ring-secondary/40",
              )}
              aria-label={menuAriaLabel}
            >
              <Avatar
                src={user.profile_picture_url}
                name={user.full_name}
                size="sm"
                className="rounded-full !bg-page text-text"
              />
              <div className="hidden min-w-0 max-w-[10rem] flex-col text-start md:flex">
                <span
                  className={cn(
                    "truncate font-semibold text-text",
                    profileNameClasses,
                  )}
                >
                  {user.full_name}
                </span>
                {roleLabel ? (
                  <span className="truncate text-xs text-muted sm:text-sm">
                    {roleLabel}
                  </span>
                ) : null}
              </div>
              <ChevronDown
                className="hidden size-4 shrink-0 text-muted md:block"
                aria-hidden
              />
            </PopoverButton>

            <PopoverPanel anchor="bottom end" className="min-w-64 !p-0">
              <div className="rounded-xl bg-surface">
                <div className="flex items-center gap-3 border-b border-secondary/15 px-4 py-3">
                  <Avatar
                    src={user.profile_picture_url}
                    name={user.full_name}
                    size="md"
                    className="rounded-full !bg-page text-text"
                  />
                  <div className="min-w-0 flex-1 text-start">
                    <p className={cn("truncate text-text", profileNameClasses)}>
                      {user.full_name}
                    </p>
                    {roleLabel ? (
                      <p className="truncate text-xs text-muted sm:text-sm">
                        {roleLabel}
                      </p>
                    ) : (
                      <p className={cn("truncate text-muted", profileEmailClasses)}>
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-2 py-2">
                  {menuEntries.map((entry) => {
                    if (entry.kind === "accountGroup") {
                      return (
                        <ProtectedProfileMenuAccountGroup
                          key={entry.titleKey}
                          title={entry.title}
                          items={entry.items}
                          router={router}
                        />
                      );
                    }

                    const Icon = MENU_ICONS[entry.labelKey];

                    return (
                      <ProtectedProfileMenuLink
                        key={entry.path}
                        path={entry.path}
                        label={entry.label}
                        icon={Icon}
                        router={router}
                      />
                    );
                  })}
                </div>

                <div className="border-t border-secondary/15 px-3 py-2">
                  <Button
                    type="button"
                    color="danger"
                    variant="solid"
                    size="sm"
                    fullWidth
                    iconStart={<LogOut className="size-4" aria-hidden />}
                    onClick={openLogoutConfirm}
                  >
                    {t("signOut")}
                  </Button>
                </div>
              </div>
            </PopoverPanel>
          </Popover>
        </PopoverGroup>
      </div>

      <ConfirmModal
        open={showLogoutConfirm}
        onClose={closeLogoutConfirm}
        onConfirm={confirmLogout}
        variant="primary"
        title={t("signOut")}
        description={t("logoutConfirmDescription")}
        icon={<LogOut className="size-6" aria-hidden />}
        confirmLabel={t("signOut")}
        isLoading={isLoggingOut}
        loadingLabel={t("signingOut")}
        confirmIcon={<LogOut className="size-4" aria-hidden />}
        cancelLabel={t("logoutCancel")}
      />
    </>
  );
}

function ProtectedProfileMenuAccountGroup({
  title,
  items,
  router,
}: {
  title: string;
  items: ProtectedProfileMenuAccountGroupItem[];
  router: ReturnType<typeof useProtectedProfileMenu>["router"];
}) {
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openSubmenu = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => setOpen(false), 200);
  }, [clearCloseTimer]);

  useEffect(() => {
    return () => clearCloseTimer();
  }, [clearCloseTimer]);

  return (
    <Popover className="relative w-full">
      <div
        onMouseEnter={openSubmenu}
        onMouseLeave={scheduleClose}
        className="w-full"
      >
        <PopoverButton
          type="button"
          onClick={(event) => event.preventDefault()}
          className={cn(
            "flex w-full !justify-start !gap-2 !rounded-lg !border-0 !bg-transparent !px-2 !py-2 !shadow-none",
            "hover:!bg-inherit-color/10 data-active:!bg-inherit-color/10",
            open && "!bg-inherit-color/10",
          )}
        >
          <User className="size-4 shrink-0" aria-hidden />
          <span className="min-w-0 flex-1 text-start text-sm sm:text-base">{title}</span>
          <ChevronRight
            className={cn(
              "size-4 shrink-0 text-muted transition-transform duration-150",
              isRtl ? "rotate-180" : "",
              open && (isRtl ? "-rotate-90" : "rotate-90"),
            )}
            aria-hidden
          />
        </PopoverButton>

        {open ? (
          <PopoverPanel
            static
            modal={false}
            anchor={isRtl ? "right start" : "left start"}
            className="z-[120] min-w-52 !overflow-visible p-1 [--anchor-gap:0.35rem]"
            transition={false}
          >
            <div
              role="menu"
              aria-label={title}
              className="flex flex-col gap-0.5"
              onMouseEnter={openSubmenu}
              onMouseLeave={scheduleClose}
            >
              {items.map((item) => {
                const Icon = MENU_ICONS[item.labelKey];

                return (
                  <ProtectedProfileMenuLink
                    key={item.path}
                    path={item.path}
                    label={item.label}
                    icon={Icon}
                    router={router}
                  />
                );
              })}
            </div>
          </PopoverPanel>
        ) : null}
      </div>
    </Popover>
  );
}

function ProtectedProfileMenuLink({
  path,
  label,
  icon: Icon,
  router,
  className,
}: {
  path: string;
  label: string;
  icon: typeof User;
  router: ReturnType<typeof useProtectedProfileMenu>["router"];
  className?: string;
}) {
  const { navigate } = useProtectedProfileMenuItem(router);

  return (
    <UiLink
      color="muted"
      variant="subtle"
      size="md"
      alwaysUnderline={false}
      iconStart={<Icon />}
      className={cn(
        "w-full justify-start rounded-lg px-2 py-2 hover:bg-inherit-color/10",
        className,
      )}
      onClick={() => navigate(path)}
    >
      {label}
    </UiLink>
  );
}
