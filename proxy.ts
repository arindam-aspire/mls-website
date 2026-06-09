import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "@/src/i18n/routing";

/**
 * Edge middleware checks for an `access_token` cookie only (presence, not role).
 * JWT role decoding and `loggedInUserRole` in Zustand happen client-side in
 * `AuthProvider` — middleware cannot update the client auth store.
 */

const handleI18nRouting = createMiddleware(routing);

const PROTECTED_ROUTES = [
  "/dashboard",
  "/my-profile",
  "/saved-searches",
  "/favourites",
  "/recently-viewed",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Run next-intl first
  const response = handleI18nRouting(request);

  const token = request.cookies.get("access_token");

  // Remove locale from path
  const pathWithoutLocale = pathname.replace(
    /^\/(en|ar|es|fr)/,
    "",
  ) || "/";

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
