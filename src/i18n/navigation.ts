import { useMemo } from "react";
import { createNavigation } from "next-intl/navigation";
import { runNavigationInterceptors } from "@/src/navigation/navigationGuard";
import { stripLocalePrefixFromPath } from "@/src/i18n/stripLocalePrefixFromPath";
import { routing } from "./routing";

const {
  Link,
  redirect,
  usePathname,
  getPathname,
  useRouter: useIntlRouter,
} = createNavigation(routing);

function resolveRouterHref(href: Parameters<
  ReturnType<typeof useIntlRouter>["push"]
>[0]): string {
  if (typeof href === "string") {
    return stripLocalePrefixFromPath(href);
  }

  if (href && typeof href === "object" && "pathname" in href) {
    return stripLocalePrefixFromPath(String(href.pathname));
  }

  return stripLocalePrefixFromPath(String(href));
}

function normalizeRouterHref(
  href: Parameters<ReturnType<typeof useIntlRouter>["push"]>[0],
): Parameters<ReturnType<typeof useIntlRouter>["push"]>[0] {
  if (typeof href === "string") {
    return stripLocalePrefixFromPath(href);
  }

  if (href && typeof href === "object" && "pathname" in href) {
    return {
      ...href,
      pathname: stripLocalePrefixFromPath(String(href.pathname)),
    };
  }

  return href;
}

export function useRouter() {
  const router = useIntlRouter();

  return useMemo(
    () => ({
      ...router,
      push: (
        href: Parameters<typeof router.push>[0],
        options?: Parameters<typeof router.push>[1],
      ) => {
        if (
          !runNavigationInterceptors({
            href: resolveRouterHref(href),
            action: "push",
          })
        ) {
          return;
        }

        return router.push(normalizeRouterHref(href), options);
      },
      replace: (
        href: Parameters<typeof router.replace>[0],
        options?: Parameters<typeof router.replace>[1],
      ) => {
        if (
          !runNavigationInterceptors({
            href: resolveRouterHref(href),
            action: "replace",
          })
        ) {
          return;
        }

        return router.replace(normalizeRouterHref(href), options);
      },
      back: () => {
        if (!runNavigationInterceptors({ href: "", action: "back" })) {
          return;
        }

        return router.back();
      },
    }),
    [router],
  );
}

export { Link, redirect, usePathname, getPathname };
