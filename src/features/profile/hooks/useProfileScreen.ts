"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { maskEmail, maskStoredPhoneNumber } from "@/src/features/auth/maskContact";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type { ProfileInfoField } from "../types/profile.types";

const ROLE_TRANSLATION_KEYS: Record<string, "roleAgency" | "roleAgent" | "roleOwner" | "roleUser"> = {
  admin: "roleAgency",
  agent: "roleAgent",
  owner: "roleOwner",
  registered_user: "roleUser",
};

function resolveRoleTranslationKey(roleName: string | undefined) {
  if (!roleName) return "roleUnknown" as const;
  return ROLE_TRANSLATION_KEYS[roleName] ?? ("roleUnknown" as const);
}

export function useProfileScreen() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const user = useAuthStore((state) => state.user);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isUploadPhotoUpcomingOpen, setIsUploadPhotoUpcomingOpen] = useState(false);
  const [isRemovePhotoUpcomingOpen, setIsRemovePhotoUpcomingOpen] = useState(false);

  const roleLabel = useMemo(() => {
    const primaryRole = user?.roles[0]?.name;
    return t(resolveRoleTranslationKey(primaryRole));
  }, [t, user?.roles]);

  const phoneRaw = user?.phone_number?.trim() ?? "";

  const phoneDisplay = useMemo(() => {
    if (!phoneRaw) {
      return user ? t("noPhone") : "";
    }
    return maskStoredPhoneNumber(phoneRaw);
  }, [phoneRaw, t, user]);

  const profileFields = useMemo((): ProfileInfoField[] => {
    if (!user) return [];

    return [
      {
        label: t("emailLabel"),
        value: maskEmail(user.email, { visibleLocalChars: 2 }),
        kind: "email",
        verified: user.is_email_verified,
      },
      {
        label: t("phoneLabel"),
        value: phoneDisplay,
        kind: "phone",
        verified: phoneRaw ? user.is_phone_verified : undefined,
      },
    ];
  }, [phoneDisplay, phoneRaw, t, user]);

  const openChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const closeChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  const openEdit = () => {
    setIsEditProfileOpen(true);
  };

  const openUploadProfilePhoto = () => {
    setIsUploadPhotoUpcomingOpen(true);
  };

  const closeUploadProfilePhoto = () => {
    setIsUploadPhotoUpcomingOpen(false);
  };

  const openRemoveProfilePhoto = () => {
    setIsRemovePhotoUpcomingOpen(true);
  };

  const closeRemoveProfilePhoto = () => {
    setIsRemovePhotoUpcomingOpen(false);
  };

  const hasProfileImage = Boolean(user?.profile_picture_url?.trim());

  return {
    user,
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    changePasswordLabel: tCommon("changePassword"),
    myProfileCard: user
      ? {
          user: {
            full_name: user.full_name,
            profile_picture_url: user.profile_picture_url,
            email: user.email,
            is_email_verified: user.is_email_verified,
            is_phone_verified: user.is_phone_verified,
          },
          roleLabel,
          sectionTitle: t("personalInfoSection"),
          fields: profileFields,
          verifiedLabel: t("verified"),
          notVerifiedLabel: t("notVerified"),
          uploadPhotoLabel: t("uploadProfilePhoto"),
          onUploadProfilePhoto: openUploadProfilePhoto,
          editLabel: t("edit"),
          onEdit: openEdit,
          ...(hasProfileImage
            ? {
                removeImageLabel: t("removeProfilePhoto"),
                onRemoveProfilePhoto: openRemoveProfilePhoto,
              }
            : {}),
        }
      : null,
    uploadPhotoUpcomingModal: {
      title: t("uploadPhotoComingSoonTitle"),
      subtitle: t("uploadPhotoComingSoonSubtitle"),
      description: t("uploadPhotoComingSoonDescription"),
      dismissLabel: t("uploadPhotoComingSoonDismiss"),
    },
    removePhotoUpcomingModal: {
      title: t("removePhotoComingSoonTitle"),
      subtitle: t("removePhotoComingSoonSubtitle"),
      description: t("removePhotoComingSoonDescription"),
      dismissLabel: t("removePhotoComingSoonDismiss"),
    },
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    openChangePassword,
    closeChangePassword,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isUploadPhotoUpcomingOpen,
    openUploadProfilePhoto,
    closeUploadProfilePhoto,
    isRemovePhotoUpcomingOpen,
    closeRemoveProfilePhoto,
  };
}
