"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { initializeNavigation } from "@/src/utils/navigation.utils";

export function NavigationInitializer() {
  const router = useRouter();

  useEffect(() => {
    initializeNavigation(router);
  }, []);

  return null;
}