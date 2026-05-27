"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useGetPropertyList } from "../mutations/property.mutation";

export default function PropertyListScreen() {
  const searchParams = useSearchParams();
  const { mutate: getPropertyList } = useGetPropertyList();

  useEffect(() => {
    getPropertyList(
      {
        page: 1,
        pageSize: 10,
        category: searchParams.get("category") ?? "",
        status: searchParams.get("status") ?? "buy",
      },
      {
        onSuccess: (response) => {
          console.log("Property list response:", response);
        },
      },
    );
  }, [getPropertyList, searchParams]);

  return (
    <ComingSoonCard
      title="Property List"
      subtitle="Under Development"
      description="Browse and filter available properties from a unified listing view. This feature is coming soon!"
    />
  );
}
