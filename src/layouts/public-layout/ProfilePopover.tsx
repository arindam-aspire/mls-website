"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { PublicNotificationsButton } from "./PublicNotificationsButton";
import { Link as UiLink } from "@/src/components/ui/link";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@/src/components/ui/popover";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { profileEmailClasses, profileNameClasses } from "@/src/lib/typography";
import { useClose } from "@headlessui/react";
import { Bell, Eye, Heart, Home, LogOut, Search, Send, User } from "lucide-react";
import { resolveProfileRoleLabel } from "@/src/features/auth/utils/resolveProfileRoleLabel";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

const PROFILE_MENU_ITEMS = [
  { labelKey: "profile", icon: User, path: "/my-profile" },
  { labelKey: "myListings", icon: Home, path: "/listing" },
  { labelKey: "myFavourites", icon: Heart, path: "/favourites" },
  { labelKey: "mySavedSearches", icon: Search, path: "/saved-searches" },
  { labelKey: "myRecentlyViewed", icon: Eye, path: "/recently-viewed" },
  { labelKey: "myInquiries", icon: Send, path: "/inquiries" },
] as const;

function ProfileMenuItems({ router }: { router: ReturnType<typeof useRouter> }) {
  const t = useTranslations("common");
  const close = useClose();

  return (
    <div className="flex flex-col gap-0.5 py-2 px-2">
      {PROFILE_MENU_ITEMS.map(({ labelKey, icon: Icon, path }) => (
        <UiLink
          key={path}
          color="muted"
          variant="subtle"
          size="md"
          alwaysUnderline={false}
          iconStart={<Icon />}
          className="w-full justify-start rounded-lg px-2 py-2 hover:bg-inherit-color/10"
          onClick={() => {
            close();
            router.push(path);
          }}
        >
          {t(labelKey)}
        </UiLink>
      ))}
    </div>
  );
}

const profileHeaderAvatarClass = "rounded-full !bg-page text-text";

const profilePopoverTriggerClass = cn(
  "!gap-2 !rounded-lg !border-0 !bg-transparent !p-0 !shadow-none",
  "hover:!bg-transparent data-active:!bg-transparent",
  "focus-visible:ring-2 focus-visible:ring-secondary/40",
);

const profileHeaderAvatarOverHeroClass =
  "rounded-full !bg-white/20 !text-white border-2 border-white/40";

interface ProfilePopoverProps {
  user: LoggedInUser;
  /** When false, omit the bell button (e.g. protected header renders its own). Default true. */
  showNotificationsButton?: boolean;
  /** Landing: name/role/avatar on hero image use light-on-image treatment. */
  overHero?: boolean;
}

export function ProfilePopover({
  user,
  showNotificationsButton = true,
  overHero = false,
}: ProfilePopoverProps) {
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const roleLabel = useMemo(
    () => resolveProfileRoleLabel(user, tAuth),
    [user, tAuth],
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut, isSuccess: isLoggedOut } = useLogout();

  useEffect(() => {
    if (isLoggedOut) {
     setShowLogoutConfirm(false);
    }
  }, [isLoggedOut]);

  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {showNotificationsButton ? (
        <PublicNotificationsButton
          overHero={overHero}
          onClick={() => setIsUpcomingFeatureModalOpen(true)}
        />
      ) : null}

      <span
        className={cn(
          "hidden h-9 w-px shrink-0 lg:block lg:h-10",
          overHero ? "bg-white/25" : "bg-secondary/15",
        )}
        aria-hidden
      />

      <Popover className="relative flex items-center">
        <PopoverButton
          className={cn(
            profilePopoverTriggerClass,
            overHero && "focus-visible:ring-white/40",
          )}
          aria-label={t("profile")}
        >
          <div className="hidden min-w-0 max-w-[10rem] flex-col text-end lg:flex">
            <span
              className={cn(
                "truncate font-semibold",
                profileNameClasses,
                overHero ? "text-white" : "text-text",
              )}
            >
              {user.full_name}
            </span>
            {roleLabel ? (
              <span
                className={cn(
                  "truncate text-end text-xs sm:text-sm",
                  overHero ? "text-white/85" : "text-muted",
                )}
              >
                {roleLabel}
              </span>
            ) : null}
          </div>
          <Avatar
            src={user.profile_picture_url}
            name={user.full_name}
            size="md"
            className={
              overHero ? profileHeaderAvatarOverHeroClass : profileHeaderAvatarClass
            }
          />
        </PopoverButton>

        <PopoverPanel anchor="bottom end" className="min-w-64">
          <div className="flex items-center gap-3 border-b border-secondary/15 px-4 py-3">
            <Avatar
              src={user.profile_picture_url}
              name={user.full_name}
              size="md"
              className={profileHeaderAvatarClass}
            />
            <div className="min-w-0 flex-1 text-start">
              <p className={cn("truncate text-text", profileNameClasses)}>
                {user.full_name}
              </p>
              {roleLabel ? (
                <p className="truncate text-xs text-muted sm:text-sm">{roleLabel}</p>
              ) : (
                <p className={cn("truncate text-muted", profileEmailClasses)}>
                  {user.email}
                </p>
              )}
            </div>
          </div>

          <ProfileMenuItems router={router} />

          <div className="border-t border-secondary/15 px-3 py-2">
            <Button
              type="button"
              color="danger"
              variant="solid"
              size="sm"
              fullWidth
              iconStart={<LogOut className="size-4" aria-hidden />}
              onClick={() => setShowLogoutConfirm(true)}
            >
              {t("signOut")}
            </Button>
          </div>
        </PopoverPanel>
      </Popover>

      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => logout()}
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

      <UpcomingFeatureModal
        open={isUpcomingFeatureModalOpen}
        onClose={() => setIsUpcomingFeatureModalOpen(false)}
        icon={<Bell className="size-7" aria-hidden />}
      />
    </div>
  );
}
