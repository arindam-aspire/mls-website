"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import type { LoggedInUser, LoggedInUserAgency } from "@/src/features/auth/types/user.types";
import { isAgencyUser } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import {
  DEFAULT_AGENCY_CURRENCY,
  DEFAULT_AGENCY_MEASUREMENT_UNIT,
} from "../constants/agencyPreferences";
import { getAgencyById } from "../services/profile.service";
import type { Agency } from "../types/profile.types";
import { useAgencyCurrencyPreference } from "./useAgencyCurrencyPreference";
import { useAgencyDisplayPreferencesRows } from "./useAgencyDisplayPreferencesRows";
import { useAgencyMeasurementUnitPreference } from "./useAgencyMeasurementUnitPreference";

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

export function useAgencySettingsScreen() {
  const t = useTranslations("profile");
  const tDisplayPreferences = useTranslations("profile.displayPreferences");
  const toast = useToast();

  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const agencyId = user?.agency?.agency_id?.trim() ?? "";
  const shouldFetchAgency = isAgencyUser(user) && agencyId.length > 0;

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

  const { upcomingFeatureModal, openUpcomingFeatureModal } =
    useAgencyDisplayPreferencesRows();

  const agencyDetails = agencyResponse?.data ?? null;
  const userAgency = user?.agency ?? null;

  const agencySource = useMemo((): Agency | null => {
    if (!user || !isAgencyUser(user)) return null;
    return agencyDetails ?? (userAgency ? agencyFromUserSummary(userAgency, user) : null);
  }, [agencyDetails, user, userAgency]);

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

  useEffect(() => {
    if (!isAgencyError) return;

    const apiError = agencyError as unknown as ApiError;
    toast.error(t("fetchAgencyErrorTitle"), {
      description: apiError.message,
    });
  }, [agencyError, isAgencyError, t, toast]);

  const isLoadingAgency =
    shouldFetchAgency &&
    (isAgencyPending || isAgencyFetching) &&
    !agencyDetails &&
    !userAgency;

  const isLoading = (isLoadingUser && !user) || isLoadingAgency;

  return {
    pageTitle: t("agencySettings.pageTitle"),
    pageSubtitle: t("agencySettings.pageSubtitle"),
    isLoading,
    currencyPreference,
    measurementUnitPreference,
    upcomingFeatureModal,
    openUpcomingFeatureModal,
  };
}
