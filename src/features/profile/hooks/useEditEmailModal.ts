"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useForm } from "@/src/hooks/useForm";
import {
  useRequestProfileUpdate,
  useVerifyProfileUpdate,
} from "../mutations/profile.mutation";
import type { EditEmailFormValues } from "../types/profile.types";
import { getProfileUpdateDevOtp } from "../utils/profileOtp.utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EditStep = "form" | "otp";

type UseEditEmailModalParams = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function useEditEmailModal({ isOpen, setIsOpen }: UseEditEmailModalParams) {
  // 2. UI utilities
  const tProfile = useTranslations("profile");
  const tAuth = useTranslations("auth");

  // 3. Global state
  const user = useAuthStore((state) => state.user);

  // 4. Local state
  const [step, setStep] = useState<EditStep>("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [displayOtp, setDisplayOtp] = useState<string | undefined>();

  // 5. Data fetching / queries
  const { mutate: requestUpdate, isPending: isRequesting } = useRequestProfileUpdate();
  const { mutate: verifyUpdate, isPending: isVerifying } = useVerifyProfileUpdate("email");

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setTouched,
  } = useForm<EditEmailFormValues>({
    initialValues: { email: "" },
    validate: (formValues) => {
      const trimmed = formValues.email.trim();

      if (!trimmed) {
        return { email: tAuth("signUpEmailRequired") };
      }
      if (!EMAIL_PATTERN.test(trimmed)) {
        return { email: tAuth("signUpEmailInvalid") };
      }
      if (originalEmail && normalizeEmail(trimmed) === originalEmail) {
        return { email: tProfile("updateEmailSameAsCurrent") };
      }
      return {};
    },
  });

  // 6. Derived / memoized values
  const isFormStep = step === "form";

  const getEmailValidationError = useCallback(
    (email: string) => {
      const trimmed = email.trim();

      if (!trimmed) {
        return tAuth("signUpEmailRequired");
      }
      if (!EMAIL_PATTERN.test(trimmed)) {
        return tAuth("signUpEmailInvalid");
      }
      if (originalEmail && normalizeEmail(trimmed) === originalEmail) {
        return tProfile("updateEmailSameAsCurrent");
      }
      return "";
    },
    [originalEmail, tAuth, tProfile],
  );

  const isSubmitDisabled = getEmailValidationError(values.email) !== "";

  // 7. Callbacks
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const resetModalState = useCallback(() => {
    setStep("form");
    setPendingEmail("");
    setDisplayOtp(undefined);

    if (user) {
      setValues({ email: user.email });
      setOriginalEmail(normalizeEmail(user.email ?? ""));
    } else {
      setOriginalEmail("");
    }
    setErrors({});
    setTouched({});
  }, [setErrors, setTouched, setValues, user]);

  const submitRequest = useCallback(
    (email: string) => {
      requestUpdate(
        { email: email.trim() },
        {
          onSuccess: (response) => {
            setPendingEmail(email.trim());
            setDisplayOtp(getProfileUpdateDevOtp(response.data));
            setStep("otp");
          },
        },
      );
    },
    [requestUpdate],
  );

  const onFormSubmit = handleSubmit((formValues) => {
    submitRequest(formValues.email);
  });

  const onOtpSubmit = useCallback(
    (code: string) => {
      if (!pendingEmail.trim()) return;

      verifyUpdate(
        {
          email: pendingEmail.trim(),
          email_otp: code,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        },
      );
    },
    [closeModal, pendingEmail, verifyUpdate],
  );

  const onResendOtp = useCallback(() => {
    if (!pendingEmail.trim()) return;
    submitRequest(pendingEmail);
  }, [pendingEmail, submitRequest]);

  const goBackToForm = useCallback(() => {
    setStep("form");
    setDisplayOtp(undefined);
  }, []);

  // 9. Effects
  useEffect(() => {
    if (!isOpen) {
      resetModalState();
      return;
    }

    resetModalState();
  }, [isOpen, resetModalState]);

  // 10. Return values
  return {
    step,
    title: tProfile("editEmailModalTitle"),
    description: isFormStep ? tProfile("editEmailModalDescription") : undefined,
    showBack: !isFormStep,
    onBack: goBackToForm,
    closeModal,
    formProps: {
      values,
      errors,
      emailLabel: tProfile("emailLabel"),
      emailPlaceholder: tAuth("signUpEmailPlaceholder"),
      submitLabel: tProfile("requestVerificationCode"),
      loadingLabel: tProfile("requestVerificationCodeLoading"),
      onChange: handleChange,
      onBlur: handleBlur,
      onFormSubmit,
      isLoading: isRequesting,
      isSubmitDisabled,
    },
    otpProps: {
      contactEmail: pendingEmail,
      displayOtp,
      onSubmit: onOtpSubmit,
      onResend: onResendOtp,
      isLoading: isVerifying,
      isResending: isRequesting,
    },
  };
}

export type { UseEditEmailModalParams };
