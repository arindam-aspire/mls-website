"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from "react";
import { getPhoneInputCountryByCode } from "@/src/components/ui/phone-input/countries";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  useRequestProfileUpdate,
  useVerifyProfileUpdate,
} from "../mutations/profile.mutation";
import {
  arePhoneNumbersEqual,
  formatPhoneNumberE164,
} from "../utils/formatPhoneNumberE164";
import { parseStoredPhoneNumber } from "../utils/parseStoredPhoneNumber";
import { getProfileUpdateDevOtp } from "../utils/profileOtp.utils";

type EditStep = "form" | "otp";

type UseEditPhoneModalParams = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function useEditPhoneModal({ isOpen, setIsOpen }: UseEditPhoneModalParams) {
  // 2. UI utilities
  const tProfile = useTranslations("profile");
  const tAuth = useTranslations("auth");

  // 3. Global state
  const user = useAuthStore((state) => state.user);

  // 4. Local state
  const [step, setStep] = useState<EditStep>("form");
  const [phoneCountryCode, setPhoneCountryCode] = useState("JO");
  const [phoneNationalNumber, setPhoneNationalNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState("");
  const [originalPhoneE164, setOriginalPhoneE164] = useState("");
  const [displayOtp, setDisplayOtp] = useState<string | undefined>();

  // 5. Data fetching / queries
  const { mutate: requestUpdate, isPending: isRequesting } = useRequestProfileUpdate();
  const { mutate: verifyUpdate, isPending: isVerifying } = useVerifyProfileUpdate("phone");

  // 6. Derived / memoized values
  const isFormStep = step === "form";

  // 7. Callbacks
  const getPhoneError = useCallback(
    (nationalNumber: string, e164: string) => {
      if (!nationalNumber.trim()) {
        return tAuth("signUpPhoneRequired");
      }
      if (nationalNumber.replace(/\D/g, "").length < 7) {
        return tAuth("signUpPhoneInvalid");
      }
      if (
        originalPhoneE164 &&
        e164 &&
        arePhoneNumbersEqual(e164, originalPhoneE164)
      ) {
        return tProfile("updatePhoneSameAsCurrent");
      }
      return "";
    },
    [originalPhoneE164, tAuth, tProfile],
  );

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const resetModalState = useCallback(() => {
    setStep("form");
    setPhoneError("");
    setPhoneTouched(false);
    setDisplayOtp(undefined);
    setPendingPhoneNumber("");

    if (!user) return;

    const parsed = parseStoredPhoneNumber(user.phone_number ?? "");
    const country = getPhoneInputCountryByCode(parsed.countryCode);
    const storedE164 =
      country && parsed.nationalNumber
        ? formatPhoneNumberE164(country.dialCode, parsed.nationalNumber)
        : user.phone_number?.trim() || "";

    setPhoneCountryCode(parsed.countryCode);
    setPhoneNationalNumber(parsed.nationalNumber);
    setPendingPhoneNumber(storedE164);
    setOriginalPhoneE164(storedE164);
  }, [user]);

  const handlePhoneChange = useCallback(
    (payload: {
      country: { iso2: string; dialCode: string };
      nationalNumber: string;
    }) => {
      setPhoneCountryCode(payload.country.iso2);
      setPhoneNationalNumber(payload.nationalNumber);

      const formatted = formatPhoneNumberE164(
        payload.country.dialCode,
        payload.nationalNumber,
      );

      setPendingPhoneNumber(formatted);

      if (phoneTouched) {
        setPhoneError(getPhoneError(payload.nationalNumber, formatted));
      }
    },
    [getPhoneError, phoneTouched],
  );

  const handlePhoneBlur = useCallback(() => {
    setPhoneTouched(true);
    const country = getPhoneInputCountryByCode(phoneCountryCode);
    const e164 = country
      ? formatPhoneNumberE164(country.dialCode, phoneNationalNumber)
      : pendingPhoneNumber;
    setPhoneError(getPhoneError(phoneNationalNumber, e164));
  }, [
    getPhoneError,
    pendingPhoneNumber,
    phoneCountryCode,
    phoneNationalNumber,
  ]);

  const submitRequest = useCallback(
    (phoneNumber: string) => {
      requestUpdate(
        { phone_number: phoneNumber.trim() },
        {
          onSuccess: (response) => {
            setPendingPhoneNumber(phoneNumber.trim());
            setDisplayOtp(getProfileUpdateDevOtp(response.data));
            setStep("otp");
          },
        },
      );
    },
    [requestUpdate],
  );

  const onFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const error = getPhoneError(phoneNationalNumber, pendingPhoneNumber);
      setPhoneTouched(true);
      setPhoneError(error);

      if (error) return;

      submitRequest(pendingPhoneNumber);
    },
    [getPhoneError, pendingPhoneNumber, phoneNationalNumber, submitRequest],
  );

  const onOtpSubmit = useCallback(
    (code: string) => {
      if (!pendingPhoneNumber.trim()) return;

      verifyUpdate(
        {
          phone_number: pendingPhoneNumber.trim(),
          phone_otp: code,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        },
      );
    },
    [closeModal, pendingPhoneNumber, verifyUpdate],
  );

  const onResendOtp = useCallback(() => {
    if (!pendingPhoneNumber.trim()) return;
    submitRequest(pendingPhoneNumber);
  }, [pendingPhoneNumber, submitRequest]);

  const goBackToForm = useCallback(() => {
    setStep("form");
    setDisplayOtp(undefined);
  }, []);

  const isPhoneUnchanged =
    originalPhoneE164 !== "" &&
    pendingPhoneNumber !== "" &&
    arePhoneNumbersEqual(pendingPhoneNumber, originalPhoneE164);

  const isSubmitDisabled =
    !phoneNationalNumber.trim() ||
    isPhoneUnchanged ||
    getPhoneError(phoneNationalNumber, pendingPhoneNumber) !== "";

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
    title: tProfile("editPhoneModalTitle"),
    description: isFormStep ? tProfile("editPhoneModalDescription") : undefined,
    showBack: !isFormStep,
    onBack: goBackToForm,
    closeModal,
    formProps: {
      phoneCountryCode,
      phoneNationalNumber,
      phoneError: phoneTouched ? phoneError : undefined,
      phoneLabel: tProfile("phoneLabel"),
      phonePlaceholder: tAuth("signUpPhonePlaceholder"),
      phoneSearchPlaceholder: tAuth("signUpPhoneSearchPlaceholder"),
      phoneEmptySearchLabel: tAuth("signUpPhoneNoMatches"),
      submitLabel: tProfile("requestVerificationCode"),
      loadingLabel: tProfile("requestVerificationCodeLoading"),
      onPhoneChange: handlePhoneChange,
      onPhoneBlur: handlePhoneBlur,
      onFormSubmit,
      isLoading: isRequesting,
      isSubmitDisabled,
    },
    otpProps: {
      contactPhone: phoneNationalNumber,
      contactPhoneCountry: phoneCountryCode,
      displayOtp,
      onSubmit: onOtpSubmit,
      onResend: onResendOtp,
      isLoading: isVerifying,
      isResending: isRequesting,
    },
  };
}

export type { UseEditPhoneModalParams };
