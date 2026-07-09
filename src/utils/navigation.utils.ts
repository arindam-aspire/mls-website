import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { runNavigationInterceptors } from "@/src/navigation/navigationGuard";
import { stripLocalePrefixFromPath } from "@/src/i18n/stripLocalePrefixFromPath";

let navigateRef: AppRouterInstance | null = null;

export const initializeNavigation = (router: AppRouterInstance) => {
  navigateRef = router;
};

export const navigateTo = (path: string) => {
  const normalizedPath = stripLocalePrefixFromPath(path);

  if (!runNavigationInterceptors({ href: normalizedPath, action: "push" })) {
    return;
  }

  if (!navigateRef) {
    console.warn("Navigation not initialized. Falling back to window.location");
    window.location.href = normalizedPath;
    return;
  }

  navigateRef.push(normalizedPath);
};

export const navigateReplace = (path: string) => {
  const normalizedPath = stripLocalePrefixFromPath(path);

  if (!runNavigationInterceptors({ href: normalizedPath, action: "replace" })) {
    return;
  }

  if (!navigateRef) {
    window.location.href = normalizedPath;
    return;
  }

  navigateRef.replace(normalizedPath);
};

export const navigateBack = () => {
  if (!runNavigationInterceptors({ href: "", action: "back" })) {
    return;
  }

  if (!navigateRef) {
    return;
  }

  navigateRef.back();
};