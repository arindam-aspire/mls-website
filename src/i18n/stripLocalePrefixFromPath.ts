import { routing, type AppLocale } from "./routing";

function isAppLocale(value: string): value is AppLocale {
  return (routing.locales as readonly string[]).includes(value);
}

/** Remove a leading locale segment from an app path (e.g. `/en/dashboard` → `/dashboard`). */
export function stripLocalePrefixFromPath(path: string): string {
  if (!path) {
    return path;
  }

  const hashIndex = path.indexOf("#");
  const pathWithoutHash = hashIndex >= 0 ? path.slice(0, hashIndex) : path;
  const hash = hashIndex >= 0 ? path.slice(hashIndex) : "";

  const searchIndex = pathWithoutHash.indexOf("?");
  const pathname =
    searchIndex >= 0 ? pathWithoutHash.slice(0, searchIndex) : pathWithoutHash;
  const search = searchIndex >= 0 ? pathWithoutHash.slice(searchIndex) : "";

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0 || !isAppLocale(segments[0])) {
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${normalizedPath}${search}${hash}`;
  }

  const rest = segments.slice(1).join("/");
  const normalizedPath = rest ? `/${rest}` : "/";

  return `${normalizedPath}${search}${hash}`;
}

/** Normalize an internal href for next-intl `router.push` (locale prefix must not be duplicated). */
export function stripLocalePrefixFromHref(href: string): string {
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return href;
  }

  try {
    const base =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost";

    const url = new URL(href, base);

    return stripLocalePrefixFromPath(
      `${url.pathname}${url.search}${url.hash}`,
    );
  } catch {
    return stripLocalePrefixFromPath(href);
  }
}
