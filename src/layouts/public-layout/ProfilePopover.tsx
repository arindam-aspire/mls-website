"use client";

import { useClose } from "@headlessui/react";
import { useEffect, useState } from "react";
import { Bell, Eye, Heart, Home, LogOut, Search, Send, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { IconButton } from "@/src/components/ui/icon-button";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@/src/components/ui/popover";
import { Link as UiLink } from "@/src/components/ui/link";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import { useRouter } from "@/src/i18n/navigation";

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

interface ProfilePopoverProps {
  user: LoggedInUser;
  overHero: boolean;
}

export function ProfilePopover({ user, overHero }: ProfilePopoverProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { mutate: logout, isPending: isLoggingOut, isSuccess: isLoggedOut } = useLogout();

  useEffect(() => {
    if (isLoggedOut) {
      setShowLogoutConfirm(false);
    }
  }, [isLoggedOut]);

  return (
    <>
      <IconButton
        icon={<Bell className="size-5" aria-hidden />}
        aria-label={t("notifications")}
        color="primary"
        variant="solid"
        isRounded={true}
        size="md"
        className={cn(
          overHero && "!bg-surface !text-inherit hover:!bg-surface/80 rounded-full",
        )}
      />

      <Popover className="relative flex items-center">
        <PopoverButton className="!rounded-full !p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
          <Avatar
            src={user.profile_picture_url}
            name={user.full_name}
            size="md"
            className={cn(
              overHero && "!bg-surface !text-primary hover:!bg-surface/80 rounded-full border-2 border-page",
            )}
          />
        </PopoverButton>

        <PopoverPanel anchor="bottom end" className="min-w-64">
          <div className="flex items-center gap-3 border-b border-secondary/15 px-4 py-3">
            <Avatar
              src={user.profile_picture_url}
              name={user.full_name}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text">{user.full_name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
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
    </>
  );
}
