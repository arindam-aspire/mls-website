"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  useConfirmRegisteredContactOtp,
  useRequestRegisteredContactOtp,
} from "../mutations/profile.mutation";
import type { ContactVerificationChannel } from "../types/profile.types";
import {
  buildRegisteredContactOtpConfirm,
  buildRegisteredContactOtpRequest,
  type RegisteredContactTarget,
} from "../utils/contactVerification.utils";
import { parseStoredPhoneNumber } from "../utils/parseStoredPhoneNumber";

type ContactVerificationSession = RegisteredContactTarget & {
  channel: ContactVerificationChannel;
  phoneCountryCode: string;
  phoneNationalNumber: string;
};

function sessionFromAccount(
  channel: ContactVerificationChannel,
  email: string,
  phoneNumber: string,
): ContactVerificationSession | null {
  if (channel === "email") {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return null;

    return {
      channel,
      email: trimmedEmail,
      phoneNumber: "",
      phoneCountryCode: "",
      phoneNationalNumber: "",
    };
  }

  const trimmedPhone = phoneNumber.trim();
  if (!trimmedPhone) return null;

  const parsed = parseStoredPhoneNumber(trimmedPhone);
  return {
    channel,
    email: "",
    phoneNumber: trimmedPhone,
    phoneCountryCode: parsed.countryCode,
    phoneNationalNumber: parsed.nationalNumber,
  };
}

export function useVerifyContactModal() {
  // 2. UI utilities
  const t = useTranslations("profile.contactVerification");
  // 3. Global state
  const user = useAuthStore((state) => state.user);

  // 4. Local state
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<ContactVerificationSession | null>(null);
  const [sendingType, setSendingType] = useState<ContactVerificationChannel | null>(null);
  const [otpSessionKey, setOtpSessionKey] = useState(0);
  const sendLock = useRef(false);

  // 5. Data fetching / queries
  const requestOtp = useRequestRegisteredContactOtp();
  const confirmOtp = useConfirmRegisteredContactOtp();

  // 6. Derived / memoized values
  const verificationType = isOpen ? (session?.channel ?? null) : null;

  // 7. Callbacks
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const startVerification = useCallback(
    (channel: ContactVerificationChannel) => {
      if (
        sendLock.current ||
        !user ||
        sendingType ||
        requestOtp.isPending ||
        confirmOtp.isPending ||
        isOpen
      ) {
        return;
      }

      const nextSession = sessionFromAccount(
        channel,
        user.email ?? "",
        user.phone_number ?? "",
      );
      if (!nextSession) return;

      sendLock.current = true;
      setSendingType(channel);

      const releaseSendLock = () => {
        sendLock.current = false;
        setSendingType(null);
      };

      requestOtp.mutate(buildRegisteredContactOtpRequest(channel, nextSession), {
        onSuccess: (result) => {
          releaseSendLock();

          if (result.alreadyVerified) return;

          setOtpSessionKey((current) => current + 1);
          setSession(nextSession);
          setIsOpen(true);
        },
        onError: () => {
          releaseSendLock();
        },
      });
    },
    [confirmOtp.isPending, isOpen, requestOtp, sendingType, user],
  );

  const startEmail = useCallback(() => {
    startVerification("email");
  }, [startVerification]);

  const startPhone = useCallback(() => {
    startVerification("phone");
  }, [startVerification]);

  const onSubmit = useCallback(
    (code: string) => {
      if (!session || confirmOtp.isPending || requestOtp.isPending) return;

      confirmOtp.mutate(buildRegisteredContactOtpConfirm(session.channel, session, code), {
        onSuccess: () => {
          setIsOpen(false);
          setSession(null);
        },
      });
    },
    [confirmOtp, requestOtp.isPending, session],
  );

  const onResend = useCallback(() => {
    if (!session || requestOtp.isPending || confirmOtp.isPending) return;
    requestOtp.mutate(
      buildRegisteredContactOtpRequest(session.channel, session, {
        resend: session.channel === "phone",
      }),
    );
  }, [confirmOtp.isPending, requestOtp, session]);

  // 10. Return values
  return {
    isOpen,
    verificationType,
    sendingType,
    otpSessionKey,
    contactEmail: session?.channel === "email" ? session.email : undefined,
    contactPhone: session?.channel === "phone" ? session.phoneNationalNumber : undefined,
    contactPhoneCountry: session?.phoneCountryCode,
    title: verificationType === "phone" ? t("phoneTitle") : t("emailTitle"),
    subtitle: t("subtitle"),
    resendLabel: verificationType === "phone" ? t("resendPhone") : t("resendEmail"),
    confirmLabel: t("confirm"),
    emailVisibleLocalChars: 2 as const,
    closeModal,
    startEmail,
    startPhone,
    onSubmit,
    onResend,
    isConfirming: confirmOtp.isPending,
    isResending: isOpen && (requestOtp.isPending || confirmOtp.isPending),
  };
}
