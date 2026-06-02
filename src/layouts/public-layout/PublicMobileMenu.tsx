"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import Image from "next/image";
import {
  Bell,
  Building2,
  ChevronRight,
  ClipboardList,
  Globe,
  Heart,
  History,
  Lock,
  LogOut,
  Moon,
  Search,
  Sun,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, type ReactNode } from "react";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { Avatar } from "@/src/components/ui/avatar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { SelectDropdown } from "@/src/components/ui/select-dropdown";
import { SettingField, SwitchField } from "@/src/components/ui/switch";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { ChangePasswordModal } from "@/src/features/profile/screens/ChangePasswordModal";
import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { isRtlLocale } from "@/src/i18n/routing";
import { cn } from "@/src/lib/cn";
import { profileEmailClasses, profileNameClasses } from "@/src/lib/typography";
import { useTheme, type ThemeMode } from "@/src/providers/ThemeProvider";
import {
  publicMobileHeaderBarClass,
  publicMobileHeaderContainerClass,
  publicMobileHeaderIconButtonClass,
  publicMobileHeaderIconClass,
  publicMobileLogoImageClass,
  publicMobileLogoLinkClass,
} from "./publicMobileHeaderStyles";

// --- Constants ---

const MOBILE_MENU_LOCALE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "en", label: "En" },
  { value: "ar", label: "Ar" },
  { value: "es", label: "Sp" },
  { value: "fr", label: "Fr" },
];

const MOBILE_MENU_LANGUAGE_SELECT_WIDTH_CLASS = "w-14";
const MOBILE_MENU_LANGUAGE_TRIGGER_CLASS = "px-1.5 gap-0.5";

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

const sectionsContainerClass = cn(
  publicMobileHeaderContainerClass,
  "flex flex-col gap-5 py-4 sm:gap-6 sm:py-5",
);

const sectionTitleClass =
  "pb-2 text-xs font-semibold uppercase tracking-wide text-muted";

const rowButtonClass =
  "flex w-full min-h-14 items-center gap-3 py-3 text-start transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/40 sm:min-h-[3.75rem]";

const rowDividerClass = "border-b border-secondary/10";

const rowIconClass =
  "flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-text";

const rowLabelClass = "min-w-0 flex-1 text-sm font-medium text-text";

const rowTrailingClass =
  "flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted";

const accountFooterClass = cn(
  publicMobileHeaderContainerClass,
  "border-t border-secondary/15 py-3 sm:py-4",
);

// --- Hooks ---

function useMobileMenuSections(
  onClose: () => void,
  onNavigate: (path: string) => void,
  onLocaleChange: (locale: string) => void,
  onOpenUpcomingFeature: (icon: ReactNode) => void,
  onOpenChangePasswordModal: () => void,
) {
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();

  const openAuth = () => {
    useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
    onClose();
  };

  const withAuth = (action: () => void) => {
    if (!user) {
      openAuth();
      return;
    }
    action();
  };

  const handleNavigate = (path: string) => {
    withAuth(() => {
      onNavigate(path);
      onClose();
    });
  };

  const openUpcomingFeature = (icon: ReactNode) => {
    withAuth(() => onOpenUpcomingFeature(icon));
  };

  const openChangePasswordModal = () => {
    withAuth(onOpenChangePasswordModal);
  };

  const handleLocaleChange = (nextLocale: AppLocale) => {
    onLocaleChange(nextLocale);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
  };

  return {
    user,
    theme,
    handleNavigate,
    openUpcomingFeature,
    openChangePasswordModal,
    handleLocaleChange,
    handleThemeChange,
  };
}

function useMobileMenuAccountFooter(
  onClose: () => void,
  onNavigate: (path: string) => void,
  onLogoutPress: () => void,
) {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const roleLabel =
    user?.roles[0]?.name ?? user?.roles[0]?.description ?? user?.email ?? "";

  return {
    user,
    isLoadingUser,
    roleLabel,
    handleSignIn: () => {
      useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
      onClose();
    },
    handleProfilePress: () => {
      onNavigate("/my-profile");
      onClose();
    },
    handleLogoutPress: onLogoutPress,
  };
}

// --- Internal UI ---

interface MenuRowProps {
  icon: LucideIcon;
  label: string;
  trailing?: ReactNode;
  showChevron?: boolean;
  showDivider?: boolean;
  onClick: () => void;
}

function MenuRow({
  icon: Icon,
  label,
  trailing,
  showChevron = true,
  showDivider = true,
  onClick,
}: MenuRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(rowButtonClass, showDivider && rowDividerClass)}
    >
      <span className={rowIconClass} aria-hidden>
        <Icon className="size-5" />
      </span>
      <span className={rowLabelClass}>{label}</span>
      {(trailing || showChevron) && (
        <span className={rowTrailingClass}>
          {trailing}
          {showChevron ? (
            <ChevronRight className="size-4 shrink-0 text-muted rtl:rotate-180" aria-hidden />
          ) : null}
        </span>
      )}
    </button>
  );
}

function MenuSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className={sectionTitleClass}>{title}</h2>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

interface MenuLanguageRowProps {
  value: AppLocale;
  onChange: (locale: AppLocale) => void;
  showDivider?: boolean;
}

function MenuLanguageRow({
  value,
  onChange,
  showDivider = true,
}: MenuLanguageRowProps) {
  const t = useTranslations("common");

  return (
    <SettingField
      className={cn(showDivider && rowDividerClass)}
      icon={<Globe className="size-5" />}
      title={t("language")}
      description={t("languageSwitchDescription")}
    >
      <SelectDropdown
        fullWidth={false}
        size="sm"
        variant="outline"
        placeholder={t("language")}
        includePlaceholderOption={false}
        listboxModal={false}
        options={MOBILE_MENU_LOCALE_OPTIONS}
        value={value}
        onChange={(next) => onChange(next as AppLocale)}
        wrapperClassName={MOBILE_MENU_LANGUAGE_SELECT_WIDTH_CLASS}
        triggerClassName={MOBILE_MENU_LANGUAGE_TRIGGER_CLASS}
        aria-label={t("language")}
      />
    </SettingField>
  );
}

interface MenuThemeRowProps {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  showDivider?: boolean;
}

function MenuThemeRow({
  value,
  onChange,
  showDivider = true,
}: MenuThemeRowProps) {
  const t = useTranslations("common");
  const isDark = value === "dark";
  const ThemeIcon = isDark ? Moon : Sun;

  return (
    <SwitchField
      className={cn(showDivider && rowDividerClass)}
      icon={<ThemeIcon className="size-5" />}
      title={t("darkMode")}
      description={t(isDark ? "themeSwitchToLight" : "themeSwitchToDark")}
      checked={isDark}
      onChange={(checked) => onChange(checked ? "dark" : "light")}
      aria-label={t("theme")}
      color="primary"
    />
  );
}

interface MenuContentProps {
  locale: AppLocale;
  closeMenuLabel: string;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLocaleChange: (locale: string) => void;
  onLogoutPress: () => void;
  onOpenUpcomingFeature: (icon: ReactNode) => void;
  onOpenChangePasswordModal: () => void;
}

function MenuContent({
  locale,
  closeMenuLabel,
  onClose,
  onNavigate,
  onLocaleChange,
  onLogoutPress,
  onOpenUpcomingFeature,
  onOpenChangePasswordModal,
}: MenuContentProps) {
  const t = useTranslations("common");
  const sections = useMobileMenuSections(
    onClose,
    onNavigate,
    onLocaleChange,
    onOpenUpcomingFeature,
    onOpenChangePasswordModal,
  );
  const account = useMobileMenuAccountFooter(onClose, onNavigate, onLogoutPress);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-page">
      <div className="sticky top-0 z-10 shrink-0 bg-primary">
        <div className={cn(publicMobileHeaderContainerClass, publicMobileHeaderBarClass)}>
          <Link
            href="/"
            onClick={onClose}
            className={cn(publicMobileLogoLinkClass, "focus-visible:ring-white/40")}
          >
            <Image
              src={mlsLogoDark}
              alt={t("brand")}
              className={publicMobileLogoImageClass}
              priority
            />
          </Link>
          <button
            type="button"
            aria-label={closeMenuLabel}
            className={cn(
              publicMobileHeaderIconButtonClass,
              "!text-white hover:!bg-white/15 focus-visible:ring-white/40",
            )}
            onClick={onClose}
          >
            <X className={publicMobileHeaderIconClass} aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          <div className={sectionsContainerClass}>
            {sections.user ? (
              <MenuSection title={t("mobileMenuAccount")}>
                <MenuRow
                  icon={User}
                  label={t("profilePersonalInfo")}
                  onClick={() => sections.handleNavigate("/my-profile")}
                />
                <MenuRow
                  icon={Building2}
                  label={t("agencySettings")}
                  onClick={() =>
                    sections.openUpcomingFeature(<Building2 className="size-7" aria-hidden />)
                  }
                />
                <MenuRow
                  icon={Bell}
                  label={t("notificationSettings")}
                  onClick={() =>
                    sections.openUpcomingFeature(<Bell className="size-7" aria-hidden />)
                  }
                />
                <MenuRow
                  icon={Lock}
                  label={t("changePassword")}
                  showDivider={false}
                  onClick={sections.openChangePasswordModal}
                />
              </MenuSection>
            ) : null}

            <MenuSection title={t("mobileMenuGeneral")}>
              <MenuLanguageRow
                value={locale}
                onChange={sections.handleLocaleChange}
              />
              <MenuThemeRow
                value={sections.theme}
                onChange={sections.handleThemeChange}
                showDivider={false}
              />
            </MenuSection>

            {sections.user ? (
              <MenuSection title={t("mobileMenuPreferences")}>
                <MenuRow
                  icon={Heart}
                  label={t("myFavourites")}
                  onClick={() => sections.handleNavigate("/favourites")}
                />
                <MenuRow
                  icon={ClipboardList}
                  label={t("myListings")}
                  onClick={() => sections.handleNavigate("/listing")}
                />
                <MenuRow
                  icon={Search}
                  label={t("mySavedSearches")}
                  onClick={() => sections.handleNavigate("/saved-searches")}
                />
                <MenuRow
                  icon={History}
                  label={t("myRecentlyViewed")}
                  showDivider={false}
                  onClick={() => sections.handleNavigate("/recently-viewed")}
                />
              </MenuSection>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 border-t border-secondary/15">
          <div className={accountFooterClass}>
            <div className="flex min-h-14 items-center gap-3 sm:min-h-16">
              {account.isLoadingUser ? (
                <>
                  <Skeleton variant="block" className="size-14 shrink-0 rounded-xl sm:size-16" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton variant="text" className="h-4 w-32" />
                    <Skeleton variant="text" className="h-3 w-24" />
                  </div>
                </>
              ) : account.user ? (
                <>
                  <button
                    type="button"
                    onClick={account.handleProfilePress}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-start transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                  >
                    <Avatar
                      src={account.user.profile_picture_url}
                      name={account.user.full_name}
                      size="lg"
                      className="!rounded-xl !size-14 sm:!size-16"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-text", profileNameClasses)}>
                        {account.user.full_name}
                      </p>
                      <p className={cn("truncate text-muted", profileEmailClasses)}>
                        {account.roleLabel}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-label={t("signOut")}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                    onClick={account.handleLogoutPress}
                  >
                    <LogOut className="size-5" aria-hidden />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={account.handleSignIn}
                  className="flex w-full min-h-14 items-center gap-3 rounded-lg px-1 text-start transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:min-h-16"
                >
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-16"
                    aria-hidden
                  >
                    <User className="size-6 sm:size-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-text", profileNameClasses)}>{t("signInSignUp")}</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Export ---

export interface PublicMobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLocaleChange: (locale: string) => void;
  locale: AppLocale;
  closeMenuLabel: string;
}

export function PublicMobileMenu({
  open,
  onClose,
  onNavigate,
  onLocaleChange,
  locale,
  closeMenuLabel,
}: PublicMobileMenuProps) {
  const t = useTranslations("common");
  const intlLocale = useLocale();
  const isRtl = isRtlLocale(intlLocale);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUpcomingFeatureOpen, setIsUpcomingFeatureOpen] = useState(false);
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] = useState(false);
  const [upcomingFeatureIcon, setUpcomingFeatureIcon] = useState<ReactNode>(null);
  const { mutate: logout, isPending: isLoggingOut, isSuccess: isLoggedOut } = useLogout();

  useEffect(() => {
    if (isLoggedOut) {
      setShowLogoutConfirm(false);
    }
  }, [isLoggedOut]);

  const handleLogoutPress = () => {
    onClose();
    setShowLogoutConfirm(true);
  };

  const handleOpenUpcomingFeature = (icon: ReactNode) => {
    onClose();
    setUpcomingFeatureIcon(icon);
    setIsUpcomingFeatureOpen(true);
  };

  const closeUpcomingFeature = () => {
    setIsUpcomingFeatureOpen(false);
    setUpcomingFeatureIcon(null);
  };

  const handleOpenChangePasswordModal = () => {
    onClose();
    setIsOpenChangePasswordModal(true);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} transition className="relative z-[120] md:hidden">
        <DialogBackdrop transition className={drawerBackdropClass} />
        <div className="fixed inset-0 z-[120] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 start-0 flex max-w-full">
              <DialogPanel transition className={drawerPanelClass(isRtl)}>
                <MenuContent
                  locale={locale}
                  closeMenuLabel={closeMenuLabel}
                  onClose={onClose}
                  onNavigate={onNavigate}
                  onLocaleChange={onLocaleChange}
                  onLogoutPress={handleLogoutPress}
                  onOpenUpcomingFeature={handleOpenUpcomingFeature}
                  onOpenChangePasswordModal={handleOpenChangePasswordModal}
                />
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>

      <UpcomingFeatureModal
        open={isUpcomingFeatureOpen}
        onClose={closeUpcomingFeature}
        icon={upcomingFeatureIcon}
      />

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

      <ChangePasswordModal
        isOpenChangePassword={isOpenChangePasswordModal}
        setIsOpenChangePassword={setIsOpenChangePasswordModal}
      />
    </>
  );
}
