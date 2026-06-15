"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import {
  addFavorite,
  addRecentView,
  assignAdminPropertyAgent,
  clearRecentViews,
  getAgentProperties,
  getAdminPropertySubmissions,
  getAgentPropertyDrafts,
  getAllFavorites,
  getFavoriteList,
  getPropertyDetails,
  deletePropertySubmission,
  getPropertyDraftSubmission,
  getPropertyFeatureCatalog,
  getPropertyList,
  getRecentViewsList,
  removeFavorite,
  removeRecentView,
  reviewAdminPropertySubmission,
  getSimilarProperties,
  savePropertyDraftSubmission,
  submitPropertyDraftSubmission,
  submitPropertySubmission,
  updatePropertyDraftSubmission,
} from "../services/property.service";
import type {
  PropertyDraftSubmissionSubmitRequestBody,
  PropertyDraftSubmissionUpdateRequestBody,
  PropertySubmissionDirectSubmitRequestBody,
} from "../types/propertyDraftSubmission.types";

export type PropertyListingsNamespace = "myListings" | "manageListings";

export const FAVORITES_ALL_QUERY_KEY = ["property", "favorites", "all"] as const;

export const useGetPropertyList = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: getPropertyList,
    onError: (error: ApiError) => {
      toast.error("Failed to fetch properties", {
        description: error.message,
      });
    },
  });
};

export const useGetPropertyDetails = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: getPropertyDetails,
    onError: (error: ApiError) => {
      toast.error("Failed to fetch property details", {
        description: error.message,
      });
    },
  });
};

export const useGetSimilarProperties = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: getSimilarProperties,
    onError: (error: ApiError) => {
      toast.error("Failed to fetch similar properties", {
        description: error.message,
      });
    },
  });
};

export const useGetPropertyFeatureCatalog = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: getPropertyFeatureCatalog,
    onError: (error: ApiError) => {
      toast.error("Failed to fetch property features", {
        description: error.message,
      });
    },
  });
};

export function useGetAllFavorites(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: FAVORITES_ALL_QUERY_KEY,
    queryFn: getAllFavorites,
    enabled: options?.enabled ?? true,
  });
}

export const useDeletePropertySubmission = (
  listingsNamespace: PropertyListingsNamespace = "myListings",
) => {
  const t = useTranslations(`propertyList.${listingsNamespace}`);
  const toast = useToast();

  return useMutation({
    mutationFn: deletePropertySubmission,
    onError: (error: ApiError) => {
      toast.error(t("deleteError"), {
        description: error.message,
      });
    },
  });
};

export const useGetPropertyDraftSubmission = () => {
  const t = useTranslations("propertyList.propertyCreate");
  const toast = useToast();

  return useMutation({
    mutationFn: getPropertyDraftSubmission,
    onError: (error: ApiError) => {
      toast.error(t("draftLoadError"), {
        description: error.message,
      });
    },
  });
};

export const useSavePropertyDraftSubmission = () => {
  return useMutation({
    mutationFn: savePropertyDraftSubmission,
  });
};

export const useUpdatePropertyDraftSubmission = () => {
  return useMutation({
    mutationFn: ({
      submissionId,
      body,
    }: {
      submissionId: string;
      body: PropertyDraftSubmissionUpdateRequestBody;
    }) => updatePropertyDraftSubmission(submissionId, body),
  });
};

export const useSubmitPropertyDraftSubmission = () => {
  return useMutation({
    mutationFn: ({
      submissionId,
      body,
    }: {
      submissionId: string;
      body: PropertyDraftSubmissionSubmitRequestBody;
    }) => submitPropertyDraftSubmission(submissionId, body),
  });
};

export const useSubmitPropertySubmission = () => {
  return useMutation({
    mutationFn: (body: PropertySubmissionDirectSubmitRequestBody) =>
      submitPropertySubmission(body),
  });
};

export const useGetAgentProperties = (
  listingsNamespace: PropertyListingsNamespace = "myListings",
) => {
  const t = useTranslations(`propertyList.${listingsNamespace}`);
  const toast = useToast();

  return useMutation({
    mutationFn: getAgentProperties,
    onError: (error: ApiError) => {
      toast.error(t("fetchError"), {
        description: error.message,
      });
    },
  });
};

export const useGetAdminPropertySubmissions = () => {
  const t = useTranslations("propertyList.manageListings");
  const toast = useToast();

  return useMutation({
    mutationFn: getAdminPropertySubmissions,
    onError: (error: ApiError) => {
      toast.error(t("fetchError"), {
        description: error.message,
      });
    },
  });
};

export const useReviewAdminPropertySubmission = () => {
  return useMutation({
    mutationFn: ({
      submissionId,
      body,
    }: {
      submissionId: string;
      body: Parameters<typeof reviewAdminPropertySubmission>[1];
    }) => reviewAdminPropertySubmission(submissionId, body),
  });
};

export const useAssignAdminPropertyAgent = () => {
  return useMutation({
    mutationFn: ({
      propertyId,
      body,
    }: {
      propertyId: string;
      body: Parameters<typeof assignAdminPropertyAgent>[1];
    }) => assignAdminPropertyAgent(propertyId, body),
  });
};

export const useGetAgentPropertyDrafts = () => {
  const t = useTranslations("propertyList.draftListings");
  const toast = useToast();

  return useMutation({
    mutationFn: getAgentPropertyDrafts,
    onError: (error: ApiError) => {
      toast.error(t("fetchError"), {
        description: error.message,
      });
    },
  });
};

export const useGetFavoriteList = () => {
  const t = useTranslations("propertyList.favourites");
  const toast = useToast();

  return useMutation({
    mutationFn: getFavoriteList,
    onError: (error: ApiError) => {
      toast.error(t("fetchError"), {
        description: error.message,
      });
    },
  });
};

export const useRemoveFavorite = () => {
  const t = useTranslations("propertyList.favourites");
  const toast = useToast();

  return useMutation({
    mutationFn: removeFavorite,
    onError: (error: ApiError) => {
      toast.error(t("removeError"), {
        description: error.message,
      });
    },
  });
};

export const useAddFavorite = () => {
  const t = useTranslations("propertyList.favourites");
  const toast = useToast();

  return useMutation({
    mutationFn: (propertyHash: number) =>
      addFavorite({ property_hash: propertyHash }),
    onError: (error: ApiError) => {
      toast.error(t("addError"), {
        description: error.message,
      });
    },
  });
};

export const useAddRecentView = () => {
  return useMutation({
    mutationFn: addRecentView,
  });
};

export const useGetRecentViewsList = () => {
  const t = useTranslations("propertyList");
  const toast = useToast();

  return useMutation({
    mutationFn: getRecentViewsList,
    onError: (error: ApiError) => {
      toast.error(t("recentlyViewed.fetchError"), {
        description: error.message,
      });
    },
  });
};

export const useClearRecentViews = () => {
  const t = useTranslations("propertyList");
  const toast = useToast();

  return useMutation({
    mutationFn: clearRecentViews,
    onError: (error: ApiError) => {
      toast.error(t("recentlyViewed.clearError"), {
        description: error.message,
      });
    },
  });
};

export const useRemoveRecentView = () => {
  const t = useTranslations("propertyList");
  const toast = useToast();

  return useMutation({
    mutationFn: removeRecentView,
    onError: (error: ApiError) => {
      toast.error(t("recentlyViewed.deleteError"), {
        description: error.message,
      });
    },
  });
};
