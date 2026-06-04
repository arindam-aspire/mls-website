"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { maskEmail, maskStoredPhoneNumber } from "@/src/features/auth/maskContact";
import type { LoggedInUser, LoggedInUserAgency } from "@/src/features/auth/types/user.types";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import { getAgencyById } from "../services/profile.service";
import type { Agency } from "../types/profile.types";
import type { ProfileInfoField } from "../types/profile.types";
import {
  DEFAULT_AGENCY_CURRENCY,
  DEFAULT_AGENCY_MEASUREMENT_UNIT,
} from "../constants/agencyPreferences";
import { useAgencyCurrencyPreference } from "./useAgencyCurrencyPreference";
import { useAgencyMeasurementUnitPreference } from "./useAgencyMeasurementUnitPreference";
import { useAgencyLogoUpload } from "./useAgencyLogoUpload";
import { useProfileAvatarUpload } from "./useProfileAvatarUpload";

function isAgencyRole(roleName: string | undefined): boolean {
  if (!roleName) return false;
  const role = roleName.toLowerCase();
  return role === "admin" || role === "agency";
}

function agencyFromUserSummary(userAgency: LoggedInUserAgency, user: LoggedInUser): Agency {
  return {
    id: userAgency.agency_id,
    agency_name: userAgency.agency_name,
    agency_trade_name: userAgency.agency_trade_name,
    legal_document_s3_link: null,
    email: userAgency.email,
    phone: userAgency.phone,
    logo_url: null,
    profile_picture_url: null,
    website: userAgency.website,
    address: null,
    city: null,
    state: null,
    country: null,
    zip_code: null,
    is_active: user.is_active,
    is_verified: user.is_email_verified,
    currency: DEFAULT_AGENCY_CURRENCY,
    measurement_unit: DEFAULT_AGENCY_MEASUREMENT_UNIT,
    created_at: user.created_at,
    updated_at: user.created_at,
  };
}

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
  const tDisplayPreferences = useTranslations("profile.displayPreferences");
  const tCommon = useTranslations("common");
  const toast = useToast();

  // 3. Global state
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  // 4. Local state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isEditEmailOpen, setIsEditEmailOpen] = useState(false);
  const [isEditPhoneOpen, setIsEditPhoneOpen] = useState(false);
  const [isEditAgencyOpen, setIsEditAgencyOpen] = useState(false);

  const primaryRoleName = user?.roles[0]?.name;
  const isAgency = isAgencyRole(primaryRoleName);
  const agencyId = user?.agency?.agency_id?.trim() ?? "";
  const shouldFetchAgency = isAgency && agencyId.length > 0;

  // 5. Data fetching / queries
  const avatarUpload = useProfileAvatarUpload();
  const agencyLogoUpload = useAgencyLogoUpload(agencyId);

  const {
    data: agencyResponse,
    isPending: isAgencyPending,
    isFetching: isAgencyFetching,
    isError: isAgencyError,
    error: agencyError,
  } = useQuery({
    queryKey: ["agency", agencyId],
    queryFn: () => getAgencyById(agencyId),
    enabled: shouldFetchAgency,
  });

  useEffect(() => {
    if (!isAgencyError) return;
    const error = agencyError as unknown as ApiError;
    toast.error(t("fetchAgencyErrorTitle"), { description: error.message });
  }, [agencyError, isAgencyError, t, toast]);

  const agencyDetails = agencyResponse?.data;
  const userAgency = user?.agency ?? null;

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

  const openEditAgency = useCallback(() => {
    setIsEditAgencyOpen(true);
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

    const contactEditProps = isAgency
      ? {}
      : {
          editLabel: t("editEmail"),
          onEdit: openEditEmail,
        };

    const phoneEditProps = isAgency
      ? {}
      : {
          editLabel: t("editPhone"),
          onEdit: openEditPhone,
        };

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
        verified: isAgency ? undefined : user.is_email_verified,
        ...contactEditProps,
      },
      {
        label: t("phoneLabel"),
        value: phoneDisplay,
        kind: "phone",
        verified: isAgency
          ? undefined
          : phoneRaw
            ? user.is_phone_verified
            : undefined,
        ...phoneEditProps,
      },
    ];
  }, [isAgency, openEditEmail, openEditPhone, phoneDisplay, phoneRaw, roleLabel, t, user]);

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

  const agencySource = useMemo((): Agency | null => {
    if (!user || !isAgency) return null;
    return agencyDetails ?? (userAgency ? agencyFromUserSummary(userAgency, user) : null);
  }, [agencyDetails, isAgency, user, userAgency]);

  const currencyPreference = useAgencyCurrencyPreference(
    agencyId,
    agencySource,
    tDisplayPreferences,
  );

  const measurementUnitPreference = useAgencyMeasurementUnitPreference(
    agencyId,
    agencySource,
    tDisplayPreferences,
  );

  const agencyProfileCard = useMemo(
    () =>
      user && isAgency && agencySource
        ? {
            agency: agencySource,
            user: {
              full_name: user.full_name,
              emailDisplay: maskEmail(user.email, { visibleLocalChars: 2 }),
              phoneDisplay: phoneRaw ? phoneDisplay : t("noPhone"),
              hasPhone: Boolean(phoneRaw),
              is_email_verified: user.is_email_verified,
              is_phone_verified: user.is_phone_verified,
            },
            sectionTitle: t("agencyInfoSection"),
            labels: {
              agencyName: t("agencyNameLabel"),
              tradeName: t("tradeNameLabel"),
              license: t("licenseLabel"),
              downloadLicense: t("downloadLicenseDocument"),
              contactName: t("contactNameLabel"),
              email: t("emailLabel"),
              phone: t("phoneLabel"),
              website: t("websiteLabel"),
              address: t("addressLabel"),
              notProvided: t("licenseNotProvided"),
            },
            uploadLogoLabel: t("uploadAgencyLogo"),
            avatarUpload: agencyLogoUpload,
            removeLogoLabel: t("removeAgencyLogo"),
            verifiedLabel: t("verified"),
            notVerifiedLabel: t("notVerified"),
            editEmailLabel: t("editEmail"),
            editPhoneLabel: t("editPhone"),
            editAgencyLabel: t("edit"),
            onEditEmail: openEditEmail,
            onEditPhone: openEditPhone,
            onEditAgency: openEditAgency,
            displayPreferences: {
              title: t("displayPreferences.title"),
              subtitle: t("displayPreferences.subtitle"),
              currency: currencyPreference,
              measurementUnit: measurementUnitPreference,
            },
          }
        : null,
    [
      currencyPreference,
      measurementUnitPreference,
      agencySource,
      tDisplayPreferences,
      agencyLogoUpload,
      isAgency,
      openEditAgency,
      openEditEmail,
      openEditPhone,
      phoneDisplay,
      phoneRaw,
      t,
      user,
    ],
  );

  const isLoadingUserPending = isLoadingUser && !user;
  const isLoadingAgency =
    shouldFetchAgency &&
    (isAgencyPending || isAgencyFetching) &&
    !agencyDetails &&
    !userAgency;
  const isLoading = isLoadingUserPending;
  const showAgencyCardSkeleton = isLoadingAgency;

  // 10. Return values
  return {
    user,
    isLoading,
    showAgencyCardSkeleton,
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    changePasswordLabel: tCommon("changePassword"),
    myProfileCard,
    agencyProfileCard,
    isChangePasswordOpen,
    setIsChangePasswordOpen,
    openChangePassword,
    closeChangePassword,
    isEditEmailOpen,
    setIsEditEmailOpen,
    isEditPhoneOpen,
    setIsEditPhoneOpen,
    agencyId,
    agencySource,
    isEditAgencyOpen,
    setIsEditAgencyOpen,
  };
}
