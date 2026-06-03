"use client";

import { MyProfileCard } from "@/src/features/profile/components/MyProfileCard";
import { ProfilePageToolbar } from "@/src/features/profile/components/ProfilePageToolbar";
import { ChangePasswordModal } from "@/src/features/profile/screens/ChangePasswordModal";
import { EditEmailModal } from "@/src/features/profile/screens/EditEmailModal";
import { EditPhoneModal } from "@/src/features/profile/screens/EditPhoneModal";
import { useProfileScreen } from "../hooks/useProfileScreen";

export default function ProfileScreen() {
  const {
    pageTitle,
    pageSubtitle,
    changePasswordLabel,
    myProfileCard,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    openChangePassword,
    isEditEmailOpen,
    setIsEditEmailOpen,
    isEditPhoneOpen,
    setIsEditPhoneOpen,
  } = useProfileScreen();

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <ProfilePageToolbar
          title={pageTitle}
          subtitle={pageSubtitle}
          changePasswordLabel={changePasswordLabel}
          onChangePassword={openChangePassword}
        />

        {myProfileCard ? <MyProfileCard {...myProfileCard} /> : null}
      </div>

      <ChangePasswordModal
        isOpenChangePassword={isChangePasswordOpen}
        setIsOpenChangePassword={setIsChangePasswordOpen}
      />

      <EditEmailModal isOpen={isEditEmailOpen} setIsOpen={setIsEditEmailOpen} />

      <EditPhoneModal isOpen={isEditPhoneOpen} setIsOpen={setIsEditPhoneOpen} />
    </>
  );
}
