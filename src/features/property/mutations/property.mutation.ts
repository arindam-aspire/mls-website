"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import {
  getPropertyDetails,
  getPropertyFeatureCatalog,
  getPropertyList,
} from "../services/property.service";

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
