"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import {
  addFavorite,
  getAllFavorites,
  getFavoriteList,
  getPropertyDetails,
  getPropertyFeatureCatalog,
  getPropertyList,
  removeFavorite,
  getSimilarProperties,
} from "../services/property.service";

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
