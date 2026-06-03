"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { maskEmail, maskStoredPhoneNumber } from "@/src/features/auth/maskContact";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type { ProfileInfoField } from "../types/profile.types";
import { useProfileAvatarUpload } from "./useProfileAvatarUpload";

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
  // 2. UI utilities
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");

  // 3. Global state
  const user = useAuthStore((state) => state.user);

  // 4. Local state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditEmailOpen, setIsEditEmailOpen] = useState(false);
  const [isEditPhoneOpen, setIsEditPhoneOpen] = useState(false);

  // 5. Data fetching / queries
  const avatarUpload = useProfileAvatarUpload();

  // 7. Callbacks (modal openers — referenced by derived profile fields)
  const openEditEmail = useCallback(() => {
    setIsEditEmailOpen(true);
  }, []);

  const openEditPhone = useCallback(() => {
    setIsEditPhoneOpen(true);
  }, []);

  const openChangePassword = useCallback(() => {
    setIsChangePasswordOpen(true);
  }, []);

  const closeChangePassword = useCallback(() => {
    setIsChangePasswordOpen(false);
  }, []);

  // 6. Derived / memoized values
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
        label: t("fullNameLabel"),
        value: user.full_name,
        kind: "name",
      },
      {
        label: t("roleLabel"),
        value: roleLabel,
        kind: "role",
      },
      {
        label: t("emailLabel"),
        value: maskEmail(user.email, { visibleLocalChars: 2 }),
        kind: "email",
        verified: user.is_email_verified,
        editLabel: t("editEmail"),
        onEdit: openEditEmail,
      },
      {
        label: t("phoneLabel"),
        value: phoneDisplay,
        kind: "phone",
        verified: phoneRaw ? user.is_phone_verified : undefined,
        editLabel: t("editPhone"),
        onEdit: openEditPhone,
      },
    ];
  }, [openEditEmail, openEditPhone, phoneDisplay, phoneRaw, roleLabel, t, user]);

  const myProfileCard = useMemo(
    () =>
      user
        ? {
            user: {
              full_name: user.full_name,
              profile_picture_url: user.profile_picture_url,
              email: user.email,
              is_email_verified: user.is_email_verified,
              is_phone_verified: user.is_phone_verified,
            },
            sectionTitle: t("personalInfoSection"),
            fields: profileFields,
            verifiedLabel: t("verified"),
            notVerifiedLabel: t("notVerified"),
            uploadPhotoLabel: t("uploadProfilePhoto"),
            photoHint: t("profilePhotoHint"),
            avatarUpload,
            removeImageLabel: t("removeProfilePhoto"),
          }
        : null,
    [avatarUpload, profileFields, t, user],
  );

  // 10. Return values
  return {
    user,
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    changePasswordLabel: tCommon("changePassword"),
    myProfileCard,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    openChangePassword,
    closeChangePassword,
    isEditEmailOpen,
    setIsEditEmailOpen,
    isEditPhoneOpen,
    setIsEditPhoneOpen,
  };
}
