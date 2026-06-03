"use client";

import { Camera, Trash2 } from "lucide-react";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { MyProfileCard } from "@/src/features/profile/components/MyProfileCard";
import { ProfilePageToolbar } from "@/src/features/profile/components/ProfilePageToolbar";
import { ChangePasswordModal } from "@/src/features/profile/screens/ChangePasswordModal";
import { EditProfileModal } from "@/src/features/profile/screens/EditProfileModal";
import { useProfileScreen } from "../hooks/useProfileScreen";

export default function ProfileScreen() {
  const {
    pageTitle,
    pageSubtitle,
    changePasswordLabel,
    myProfileCard,
    uploadPhotoUpcomingModal,
    removePhotoUpcomingModal,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    openChangePassword,
    isEditProfileOpen,
    setIsEditProfileOpen,
    closeUploadProfilePhoto,
    isUploadPhotoUpcomingOpen,
    closeRemoveProfilePhoto,
    isRemovePhotoUpcomingOpen,
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

      <EditProfileModal
        isOpenEditProfile={isEditProfileOpen}
        setIsOpenEditProfile={setIsEditProfileOpen}
      />

      <UpcomingFeatureModal
        open={isUploadPhotoUpcomingOpen}
        onClose={closeUploadProfilePhoto}
        title={uploadPhotoUpcomingModal.title}
        subtitle={uploadPhotoUpcomingModal.subtitle}
        description={uploadPhotoUpcomingModal.description}
        dismissLabel={uploadPhotoUpcomingModal.dismissLabel}
        icon={<Camera className="size-7" aria-hidden />}
      />

      <UpcomingFeatureModal
        open={isRemovePhotoUpcomingOpen}
        onClose={closeRemoveProfilePhoto}
        title={removePhotoUpcomingModal.title}
        subtitle={removePhotoUpcomingModal.subtitle}
        description={removePhotoUpcomingModal.description}
        dismissLabel={removePhotoUpcomingModal.dismissLabel}
        icon={<Trash2 className="size-7" aria-hidden />}
      />
    </>
  );
}
