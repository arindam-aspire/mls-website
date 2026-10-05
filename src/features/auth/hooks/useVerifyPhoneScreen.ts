"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";
import { useToast } from "@/src/hooks/useToast";
import type { AppLocale } from "@/src/i18n/routing";
import {
  useRequestProfileUpdate,
  useVerifyProfileUpdate,
} from "@/src/features/profile/mutations/profile.mutation";
import { createSmsRequestLock } from "@/src/features/profile/utils/registeredMobileSms.utils";
import { useAuthStore } from "../store/auth.store";
import { finishAuthenticatedSession } from "../utils/finishAuthenticatedSession";
import {
  canFinishAfterPhoneVerification,
  hasSignupPhoneNumber,
  requestSignupPhoneOtp,
  resolveRegisteredPhoneForVerification,
} from "../utils/signupPhoneVerification";
import { useAuthScreenLegalFooter } from "./authScreen.utils";

export function useVerifyPhoneScreen() {
  const tApi = useTranslations("auth.api");
  const locale = useLocale() as AppLocale;
  const { termsText, privacyText } = useAuthScreenLegalFooter();
  const toast = useToast();

  const user = useAuthStore((state) => state.user);
  const pendingPhone = useAuthStore((state) => state.pendingPhone);
  const lockRef = useRef(createSmsRequestLock());
  const didAutoSend = useRef(false);

  const phoneNumber = resolveRegisteredPhoneForVerification({
    accountPhone: user?.phone_number,
    signupPhone: pendingPhone,
  });

  const { mutateAsync: requestUpdate, isPending: isRequesting } =
    useRequestProfileUpdate();
  const { mutate: verifyUpdate, isPending: isVerifying } =
    useVerifyProfileUpdate("phone");

  const notifyMissingPhone = useCallback(() => {
    toast.info(tApi("missingPhoneTitle"), {
      description: tApi("missingPhoneDescription"),
    });
  }, [tApi, toast]);

  const sendOtp = useCallback(async () => {
    try {
      const outcome = await requestSignupPhoneOtp({
        phoneNumber,
        lock: lockRef.current,
        send: (registeredPhone) =>
          requestUpdate({ phone_number: registeredPhone }),
      });

      if (outcome.status === "missing_phone") {
        notifyMissingPhone();
      }
    } catch {
      // The profile request mutation already shows the API error.
    }
  }, [notifyMissingPhone, phoneNumber, requestUpdate]);

  const onSubmit = useCallback(
    (code: string) => {
      if (!hasSignupPhoneNumber(phoneNumber)) {
        notifyMissingPhone();
        return;
      }

      verifyUpdate(
        {
          phone_number: phoneNumber,
          phone_otp: code,
        },
        {
          onSuccess: (updatedUser) => {
            if (!canFinishAfterPhoneVerification(updatedUser.is_phone_verified)) {
              return;
            }
            finishAuthenticatedSession(locale);
          },
        },
      );
    },
    [locale, notifyMissingPhone, phoneNumber, verifyUpdate],
  );

  const onResend = useCallback(() => {
    void sendOtp();
  }, [sendOtp]);

  useEffect(() => {
    if (didAutoSend.current) return;
    didAutoSend.current = true;
    void sendOtp();
  }, [sendOtp]);

  return {
    contactPhone: phoneNumber || undefined,
    onSubmit,
    onResend,
    isLoading: isVerifying,
    isResending: isRequesting,
    termsText,
    privacyText,
  };
}
