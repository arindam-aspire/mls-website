"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Link as UiLink } from "@/src/components/ui/link";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@/src/components/ui/popover";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import {
  useProtectedProfileMenu,
  useProtectedProfileMenuItem,
} from "@/src/layouts/protected-layout/hooks/useProtectedProfileMenu";
import { cn } from "@/src/lib/cn";
import { profileEmailClasses, profileNameClasses } from "@/src/lib/typography";
import { Eye, Heart, List, LogOut, Search, Send, User } from "lucide-react";

const MENU_ICONS = {
  profile: User,
  myListings: List,
  manageListings: List,
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
    menuItems,
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
          className="hidden h-9 w-px shrink-0 bg-secondary/15 lg:block lg:h-10"
          aria-hidden
        />

        <Popover className="relative flex items-center">
          <PopoverButton
            className={cn(
              "!gap-2 !rounded-lg !border-0 !bg-transparent !p-0 !shadow-none",
              "hover:!bg-transparent data-active:!bg-transparent",
              "focus-visible:ring-2 focus-visible:ring-secondary/40",
            )}
            aria-label={t("profile")}
          >
            <div className="hidden min-w-0 max-w-[10rem] flex-col text-end lg:flex">
              <span
                className={cn(
                  "truncate font-semibold text-text",
                  profileNameClasses,
                )}
              >
                {user.full_name}
              </span>
              {roleLabel ? (
                <span className="truncate text-end text-xs text-muted sm:text-sm">
                  {roleLabel}
                </span>
              ) : null}
            </div>
            <Avatar
              src={user.profile_picture_url}
              name={user.full_name}
              size="md"
              className="rounded-full !bg-page text-text"
            />
          </PopoverButton>

          <PopoverPanel anchor="bottom end" className="min-w-64">
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

            <div className="flex flex-col gap-0.5 px-2 py-2">
              {menuItems.map(({ labelKey, label, path }) => {
                const Icon = MENU_ICONS[labelKey];
                return (
                  <ProtectedProfileMenuLink
                    key={path}
                    path={path}
                    label={label}
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
          </PopoverPanel>
        </Popover>
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

function ProtectedProfileMenuLink({
  path,
  label,
  icon: Icon,
  router,
}: {
  path: string;
  label: string;
  icon: typeof User;
  router: ReturnType<typeof useProtectedProfileMenu>["router"];
}) {
  const { navigate } = useProtectedProfileMenuItem(router);

  return (
    <UiLink
      color="muted"
      variant="subtle"
      size="md"
      alwaysUnderline={false}
      iconStart={<Icon />}
      className="w-full justify-start rounded-lg px-2 py-2 hover:bg-inherit-color/10"
      onClick={() => navigate(path)}
    >
      {label}
    </UiLink>
  );
}
