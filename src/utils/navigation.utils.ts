import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { routing, type AppLocale } from "@/src/i18n/routing";
import { stripLocalePrefixFromPath } from "@/src/i18n/stripLocalePrefixFromPath";
import { runNavigationInterceptors } from "@/src/navigation/navigationGuard";

let navigateRef: AppRouterInstance | null = null;

export const initializeNavigation = (router: AppRouterInstance) => {
  navigateRef = router;
};

function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

/**
 * `NavigationInitializer` registers `next/navigation`'s router (root layout is
 * outside `NextIntlClientProvider`). That router matches `app/[locale]/...`, so
 * hrefs must keep the locale prefix (`/en/dashboard`). Stripping it sends
 * `/dashboard`, which is parsed as `locale="dashboard"` and renders the 404 page.
 */
function toNextNavigationHref(path: string): string {
  if (!path.startsWith("/")) {
    return path;
  }

  const firstSegment = path.split("/").filter(Boolean)[0];
  if (!firstSegment || isAppLocale(firstSegment)) {
    return path;
  }

  if (typeof window === "undefined") {
    return path;
  }

  const currentLocale = window.location.pathname.split("/").filter(Boolean)[0];
  if (!currentLocale || !isAppLocale(currentLocale)) {
    return path;
  }

  return `/${currentLocale}${path}`;
}

export const navigateTo = (path: string) => {
  const interceptorHref = stripLocalePrefixFromPath(path);
  const href = toNextNavigationHref(path);

  if (!runNavigationInterceptors({ href: interceptorHref, action: "push" })) {
    return;
  }

  if (!navigateRef) {
    console.warn("Navigation not initialized. Falling back to window.location");
    window.location.href = href;
    return;
  }

  navigateRef.push(href);
};

export const navigateReplace = (path: string) => {
  const interceptorHref = stripLocalePrefixFromPath(path);
  const href = toNextNavigationHref(path);

  if (!runNavigationInterceptors({ href: interceptorHref, action: "replace" })) {
    return;
  }

  if (!navigateRef) {
    window.location.href = href;
    return;
  }

  navigateRef.replace(href);
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
