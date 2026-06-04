"use client";

import { MyProfileCard } from "@/src/features/profile/components/MyProfileCard";
import { ProfilePageToolbar } from "@/src/features/profile/components/ProfilePageToolbar";
import { cn } from "@/src/lib/cn";
import { ProfileScreenSkeleton } from "@/src/features/profile/components/ProfileScreenSkeleton";
import { ChangePasswordModal } from "@/src/features/profile/screens/ChangePasswordModal";
import { EditEmailModal } from "@/src/features/profile/screens/EditEmailModal";
import { EditPhoneModal } from "@/src/features/profile/screens/EditPhoneModal";
import { EditAgencyModal } from "@/src/features/profile/screens/EditAgencyModal";
import { AgencyProfileCard } from "@/src/features/profile/components/AgencyProfileCard";
import { MyProfileCardSkeleton } from "@/src/features/profile/components/MyProfileCardSkeleton";
import { useProfileScreen } from "../hooks/useProfileScreen";

export default function ProfileScreen() {
  const {
    isLoading,
    pageTitle,
    pageSubtitle,
    changePasswordLabel,
    myProfileCard,
    agencyProfileCard,
    showAgencyCardSkeleton,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    openChangePassword,
    isEditEmailOpen,
    setIsEditEmailOpen,
    isEditPhoneOpen,
    setIsEditPhoneOpen,
    agencyId,
    agencySource,
    isEditAgencyOpen,
    setIsEditAgencyOpen,
  } = useProfileScreen();

  if (isLoading) {
    return <ProfileScreenSkeleton />;
  }

  const hasAgencySection = showAgencyCardSkeleton || Boolean(agencyProfileCard);

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <ProfilePageToolbar
          title={pageTitle}
          subtitle={pageSubtitle}
          changePasswordLabel={changePasswordLabel}
          onChangePassword={openChangePassword}
        />
        <div
          className={cn(
            "flex w-full min-w-0 flex-col justify-center gap-2 md:gap-4",
            hasAgencySection
              ? "lg:flex-row lg:items-start lg:gap-6"
              : "md:items-center lg:items-center",
          )}
        >
          {myProfileCard ? (
            <aside
              className={cn(
                "w-full shrink-0",
                hasAgencySection
                  ? "lg:sticky lg:top-24 lg:z-10 lg:w-auto lg:self-start"
                  : "flex justify-center md:justify-center lg:justify-center",
              )}
            >
              <div className={cn("w-full", !hasAgencySection && "max-w-md")}>
                <MyProfileCard {...myProfileCard} />
              </div>
            </aside>
          ) : null}
          {hasAgencySection ? (
            <div className="flex min-w-0 w-full flex-1 flex-col gap-2 md:gap-4 lg:gap-6">
              {showAgencyCardSkeleton ? <MyProfileCardSkeleton /> : null}
              {agencyProfileCard ? <AgencyProfileCard {...agencyProfileCard} /> : null}
            </div>
          ) : null}
        </div>
      </div>

      <ChangePasswordModal
        isOpenChangePassword={isChangePasswordOpen}
        setIsOpenChangePassword={setIsChangePasswordOpen}
      />

      <EditEmailModal isOpen={isEditEmailOpen} setIsOpen={setIsEditEmailOpen} />

      <EditPhoneModal isOpen={isEditPhoneOpen} setIsOpen={setIsEditPhoneOpen} />

      <EditAgencyModal
        agencyId={agencyId}
        agency={agencySource}
        isOpen={isEditAgencyOpen}
        setIsOpen={setIsEditAgencyOpen}
      />
    </>
  );
}
