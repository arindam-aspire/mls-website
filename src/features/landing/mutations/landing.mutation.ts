"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import { usePropertyStore } from "@/src/features/property/store/property.store";
import { getPropertyTaxonomy } from "../services/landing.service";

export const useGetPropertyTaxonomy = () => {
  const toast = useToast();
  const { setPropertyTaxonomy } = usePropertyStore();

  return useMutation({
    mutationFn: getPropertyTaxonomy,
    onSuccess: (response) => {
      setPropertyTaxonomy(response);
    },
    onError: (error: ApiError) => {
      toast.error("Failed to fetch property taxonomy", {
        description: error.message,
      });
    },
  });
};
