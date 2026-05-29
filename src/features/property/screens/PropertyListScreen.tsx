"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetPropertyList } from "../mutations/property.mutation";
import { usePropertyStore } from "../store/property.store";
import type { PropertyListParams } from "../types/property.types";

function hasSameParams(current: PropertyListParams, next: PropertyListParams) {
  return (
    current.page === next.page &&
    current.pageSize === next.pageSize &&
    current.category === next.category &&
    current.status === next.status
  );
}

export default function PropertyListScreen() {
  const searchParams = useSearchParams();
  const { mutate: getPropertyList } = useGetPropertyList();
  const {
    propertyListings,
    propertyListParams,
    setPropertyListings,
    setPropertyListParams,
  } = usePropertyStore();

  const [layoutVariant, setLayoutVariant] =
    useState<"grid" | "list">("grid");


  useEffect(() => {
    const nextParams = {
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 10,
      category: searchParams.get("category") || "",
      status: searchParams.get("status") || "",
    };

    const paramsUnchanged = hasSameParams(propertyListParams, nextParams);

    if (!paramsUnchanged) {
      setPropertyListParams(nextParams);
    }

    if (
      propertyListings != null &&
      paramsUnchanged
    ) {
      return;
    }

    getPropertyList(
      nextParams,
      {
        onSuccess: (response) => {
          const listings = {
            items: response?.data?.items,
            meta: response?.meta?.pagination,
          };
          setPropertyListings(listings);
        },
      },
    );
  }, [
    getPropertyList,
    propertyListParams,
    propertyListings,
    searchParams,
    setPropertyListParams,
    setPropertyListings,
  ]);

  return (
    <>
    <ComingSoonCard
      title="Property List"
      subtitle="Under Development"
      description="Browse and filter available properties from a unified listing view. This feature is coming soon!"
      />
      </>
  );
}
