"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { isApiError, type ApiError } from "@/src/apis/core/error.normalizer";
import { useRouter } from "@/src/i18n/navigation";
import { useSignInWithSocial } from "../mutations/auth.mutation";
import { resolveSocialAuthErrorMessage } from "../utils/socialAuthError";
import {
  clearSocialOAuthPending,
  closeSocialOAuthPopup,
  consumeSocialOAuthPending,
  isSocialOAuthCancellation,
  isSocialOAuthPopup,
  parseSocialOAuthCallback,
  publishSocialOAuthPopupResult,
  type SocialOAuthPopupResult,
} from "../utils/socialOAuth";

type CallbackStatus = "loading" | "error";

type CallbackOutcome =
  | { type: "success" }
  | { type: "error"; title: string; description: string };

type SocialTranslate = ReturnType<typeof useTranslations<"auth.socialOAuth">>;

let activeCallback: Promise<CallbackOutcome> | null = null;

function finishInProviderWindow(result: SocialOAuthPopupResult): void {
  if (!isSocialOAuthPopup()) return;
  try {
    publishSocialOAuthPopupResult(result);
  } catch {
    // The original window treats a closed provider window with no result as cancelled.
  }
  closeSocialOAuthPopup();
}

async function completeSocialCallback(
  mutateAsync: ReturnType<typeof useSignInWithSocial>["mutateAsync"],
  t: SocialTranslate,
): Promise<CallbackOutcome> {
  const query = parseSocialOAuthCallback(window.location.search);

  if (isSocialOAuthCancellation(query.error)) {
    clearSocialOAuthPending();
    finishInProviderWindow({ status: "cancelled", at: Date.now() });
    return {
      type: "error",
      title: t("cancelledTitle"),
      description: t("cancelledDescription"),
    };
  }

  if (query.error || !query.code || !query.state) {
    clearSocialOAuthPending();
    finishInProviderWindow({
      status: "error",
      title: t("failedTitle"),
      description: t("invalidSession"),
      at: Date.now(),
    });
    return {
      type: "error",
      title: t("failedTitle"),
      description: t("invalidSession"),
    };
  }

  const pending = consumeSocialOAuthPending(query.state);
  if (!pending) {
    finishInProviderWindow({
      status: "error",
      title: t("failedTitle"),
      description: t("invalidSession"),
      at: Date.now(),
    });
    return {
      type: "error",
      title: t("failedTitle"),
      description: t("invalidSession"),
    };
  }

  window.history.replaceState(null, "", window.location.pathname);

  try {
    const response = await mutateAsync({
      provider: pending.provider,
      role: pending.role,
      locale: pending.locale,
      code: query.code,
      code_verifier: pending.codeVerifier,
      redirect_uri: pending.redirectUri,
    });
    finishInProviderWindow({
      status: "success",
      locale: pending.locale,
      role: pending.role,
      requiresPasswordSet: response.data.requires_password_set,
      rememberMeCookie: response.data.remember_me_cookie,
      at: Date.now(),
    });
    return { type: "success" };
  } catch (error: unknown) {
    const apiError: ApiError = isApiError(error)
      ? error
      : { code: "UNKNOWN", message: "" };
    const description = resolveSocialAuthErrorMessage(apiError, t) || t("failedDescription");
    finishInProviderWindow({
      status: "error",
      title: t("failedTitle"),
      description,
      at: Date.now(),
    });
    return {
      type: "error",
      title: t("failedTitle"),
      description,
    };
  }
}

export function useSocialOAuthCallback() {
  const t = useTranslations("auth.socialOAuth");
  const router = useRouter();
  const { mutateAsync } = useSignInWithSocial();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [title, setTitle] = useState(t("callbackTitle"));
  const [description, setDescription] = useState(t("callbackLoading"));

  const onHome = () => {
    router.replace("/");
  };

  useEffect(() => {
    let active = true;

    if (!activeCallback) {
      const task = completeSocialCallback(mutateAsync, t);
      activeCallback = task.finally(() => {
        activeCallback = null;
      });
    }

    void activeCallback.then((outcome) => {
      if (!active || outcome.type === "success") return;
      setTitle(outcome.title);
      setDescription(outcome.description);
      setStatus("error");
    });

    return () => {
      active = false;
    };
  }, [mutateAsync, t]);

  return {
    status,
    title,
    description,
    homeLabel: t("backHome"),
    onHome,
  };
}
