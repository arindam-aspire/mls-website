"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  getPublicAppOrigin,
  readSocialOAuthPublicConfig,
} from "@/src/configs/environment.config";
import { useToast } from "@/src/hooks/useToast";
import type { AppLocale } from "@/src/i18n/routing";
import type { SocialAuthProvider } from "../components/SocialAuthForm";
import { resolveSignInRole } from "../types/signIn.types";
import { isSocialAccountRole } from "../types/socialLogin.types";
import type { SocialAccountType } from "../components/SocialAuthForm";
import { resumeSocialSignInFromPopup } from "../mutations/auth.mutation";
import {
  createSocialAuthorizeRequest,
  openSocialOAuthWindow,
  parseSocialOAuthPopupResult,
  resolveSocialRedirectUri,
  saveSocialOAuthPending,
  SOCIAL_OAUTH_RESULT_KEY,
  takeSocialOAuthPopupResult,
  type SocialOAuthPopupResult,
  type SocialOAuthProvider,
} from "../utils/socialOAuth";

type UseSocialProviderAuthParams = {
  accountType: SocialAccountType;
};

function watchSocialOAuthWindow(
  popup: Window,
  watchRef: { current: (() => void) | null },
  handlers: { onResult: (result: SocialOAuthPopupResult) => void },
) {
  watchRef.current?.();
  let settled = false;

  const finish = (result: SocialOAuthPopupResult | null, closed: boolean) => {
    if (settled) return;
    if (!result && !closed) return;
    settled = true;
    cleanup();
    handlers.onResult(result ?? { status: "cancelled", at: Date.now() });
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== SOCIAL_OAUTH_RESULT_KEY || !event.newValue) return;
    const result = parseSocialOAuthPopupResult(event.newValue);
    try {
      window.localStorage.removeItem(SOCIAL_OAUTH_RESULT_KEY);
    } catch {
      // The popup result is still applied from the event payload.
    }
    finish(result, false);
  };

  const timer = window.setInterval(() => {
    if (!popup.closed) return;
    finish(takeSocialOAuthPopupResult(), true);
  }, 300);

  const cleanup = () => {
    window.clearInterval(timer);
    window.removeEventListener("storage", onStorage);
    if (watchRef.current === cleanup) watchRef.current = null;
  };

  window.addEventListener("storage", onStorage);
  watchRef.current = cleanup;
}

export function useSocialProviderAuth({ accountType }: UseSocialProviderAuthParams) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("auth.socialOAuth");
  const toast = useToast();
  const [pendingProvider, setPendingProvider] = useState<SocialOAuthProvider | null>(null);
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);
  const startingRef = useRef(false);
  const popupWatchRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);

  const onCloseUpcomingFeatureModal = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const onSocialProviderClick = useCallback(
    (provider: SocialAuthProvider) => {
      if (startingRef.current) return;

      if (provider === "apple") {
        setIsUpcomingFeatureModalOpen(true);
        return;
      }

      const role = resolveSignInRole(accountType);
      if (!isSocialAccountRole(role)) {
        toast.error(t("failedTitle"), { description: t("roleNotAllowed") });
        return;
      }

      const config = readSocialOAuthPublicConfig();
      const redirectUri = resolveSocialRedirectUri({
        origin: getPublicAppOrigin() || window.location.origin,
        locale,
        override: config.redirectUriOverride,
      });

      if (!redirectUri) {
        toast.error(t("failedTitle"), { description: t("notConfigured") });
        return;
      }

      const popup = openSocialOAuthWindow();
      if (!popup) {
        toast.error(t("failedTitle"), { description: t("popupBlocked") });
        return;
      }

      startingRef.current = true;
      setPendingProvider(provider);

      void createSocialAuthorizeRequest({
        provider,
        config,
        redirectUri,
        role,
        locale,
      })
        .then((request) => {
          if (popup.closed) {
            startingRef.current = false;
            setPendingProvider(null);
            toast.error(t("cancelledTitle"), { description: t("cancelledDescription") });
            return;
          }

          if (!request) {
            popup.close();
            startingRef.current = false;
            setPendingProvider(null);
            toast.error(t("failedTitle"), { description: t("notConfigured") });
            return;
          }

          try {
            saveSocialOAuthPending(request.pending, popup.sessionStorage);
          } catch {
            popup.close();
            startingRef.current = false;
            setPendingProvider(null);
            toast.error(t("failedTitle"), { description: t("failedDescription") });
            return;
          }

          watchSocialOAuthWindow(popup, popupWatchRef, {
            onResult: (result) => {
              startingRef.current = false;
              if (mountedRef.current) setPendingProvider(null);
              if (result.status === "success") {
                void resumeSocialSignInFromPopup({
                  locale: result.locale,
                  role: result.role,
                  requiresPasswordSet: result.requiresPasswordSet,
                  rememberMeCookie: result.rememberMeCookie,
                  onProfileError: (message) => {
                    toast.error(t("failedTitle"), { description: message });
                  },
                });
                return;
              }
              if (result.status === "error") {
                toast.error(result.title, { description: result.description });
                return;
              }
              toast.error(t("cancelledTitle"), { description: t("cancelledDescription") });
            },
          });
          popup.location.replace(request.url);
          popup.focus();
        })
        .catch(() => {
          if (!popup.closed) popup.close();
          startingRef.current = false;
          setPendingProvider(null);
          toast.error(t("failedTitle"), { description: t("failedDescription") });
        });
    },
    [accountType, locale, t, toast],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    onSocialProviderClick,
    pendingProvider,
    isUpcomingFeatureModalOpen,
    onCloseUpcomingFeatureModal,
  };
}
