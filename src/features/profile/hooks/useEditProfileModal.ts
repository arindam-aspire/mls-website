"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useForm } from "@/src/hooks/useForm";
import { useUpdateProfile } from "../mutations/profile.mutation";
import type { EditProfileFormValues } from "../types/profile.types";
import { parseStoredPhoneNumber } from "../utils/parseStoredPhoneNumber";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UseEditProfileModalParams = {
  isOpen: boolean;
  setIsOpenEditProfile: Dispatch<SetStateAction<boolean>>;
};

export function useEditProfileModal({
  isOpen,
  setIsOpenEditProfile,
}: UseEditProfileModalParams) {
  const tProfile = useTranslations("profile");
  const tAuth = useTranslations("auth");
  const user = useAuthStore((state) => state.user);
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [phoneCountryCode, setPhoneCountryCode] = useState("JO");
  const [phoneNationalNumber, setPhoneNationalNumber] = useState("");

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setTouched,
  } = useForm<EditProfileFormValues>({
    initialValues: {
      email: "",
      phone_number: "",
    },
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof EditProfileFormValues, string>> = {};

      if (!formValues.email.trim()) {
        nextErrors.email = tAuth("signUpEmailRequired");
      } else if (!EMAIL_PATTERN.test(formValues.email.trim())) {
        nextErrors.email = tAuth("signUpEmailInvalid");
      }

      if (!phoneNationalNumber.trim()) {
        nextErrors.phone_number = tAuth("signUpPhoneRequired");
      } else if (phoneNationalNumber.replace(/\D/g, "").length < 7) {
        nextErrors.phone_number = tAuth("signUpPhoneInvalid");
      }

      return nextErrors;
    },
  });

  const getPhoneError = (nationalNumber: string) => {
    if (!nationalNumber.trim()) {
      return tAuth("signUpPhoneRequired");
    }
    if (nationalNumber.replace(/\D/g, "").length < 7) {
      return tAuth("signUpPhoneInvalid");
    }
    return "";
  };

  const closeModal = () => {
    setIsOpenEditProfile(false);
  };

  const handlePhoneChange = (payload: {
    country: { iso2: string; dialCode: string };
    nationalNumber: string;
  }) => {
    setPhoneCountryCode(payload.country.iso2);
    setPhoneNationalNumber(payload.nationalNumber);

    const phoneNumber = payload.nationalNumber
      ? `${payload.country.dialCode} ${payload.nationalNumber}`
      : "";

    setValues((prev) => ({
      ...prev,
      phone_number: phoneNumber,
    }));

    if (touched.phone_number) {
      setErrors((prev) => ({
        ...prev,
        phone_number: getPhoneError(payload.nationalNumber),
      }));
    }
  };

  const handlePhoneBlur = () => {
    setTouched((prev) => ({ ...prev, phone_number: true }));
    setErrors((prev) => ({
      ...prev,
      phone_number: getPhoneError(phoneNationalNumber),
    }));
  };

  const onFormSubmit = handleSubmit((formValues) => {
    updateProfile(
      {
        email: formValues.email.trim(),
        phone_number: formValues.phone_number.trim(),
      },
      {
        onSuccess: () => {
          closeModal();
        },
      },
    );
  });

  useEffect(() => {
    if (!isOpen || !user) {
      return;
    }

    const parsed = parseStoredPhoneNumber(user.phone_number ?? "");

    setPhoneCountryCode(parsed.countryCode);
    setPhoneNationalNumber(parsed.nationalNumber);
    setValues({
      email: user.email,
      phone_number: parsed.formatted,
    });
    setErrors({});
    setTouched({});
  }, [isOpen, setErrors, setTouched, setValues, user]);

  return {
    title: tProfile("editModalTitle"),
    description: tProfile("editModalDescription"),
    isSubmitting: isPending,
    closeModal,
    formProps: {
      values,
      errors,
      phoneCountryCode,
      phoneNationalNumber,
      emailLabel: tProfile("emailLabel"),
      emailPlaceholder: tAuth("signUpEmailPlaceholder"),
      phoneLabel: tProfile("phoneLabel"),
      phonePlaceholder: tAuth("signUpPhonePlaceholder"),
      phoneSearchPlaceholder: tAuth("signUpPhoneSearchPlaceholder"),
      phoneEmptySearchLabel: tAuth("signUpPhoneNoMatches"),
      submitLabel: tProfile("saveChanges"),
      loadingLabel: tProfile("saveChangesLoading"),
      onChange: handleChange,
      onBlur: handleBlur,
      onPhoneChange: handlePhoneChange,
      onPhoneBlur: handlePhoneBlur,
      onFormSubmit,
      isLoading: isPending,
    },
  };
}

export type { UseEditProfileModalParams };
