"use client";

import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import { getPropertyList } from "../services/property.service";

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
