"use client";

import { useGetLocationTaxonomy } from "@/src/features/landing/mutations/landing.mutation";
import { formatPhoneNumberE164 } from "@/src/features/profile/utils/formatPhoneNumberE164";
import { usePropertyStore } from "@/src/features/property/store/property.store";
import { getPhoneInputCountryByCode } from "@/src/components/ui/phone-input/countries";
import { useToast } from "@/src/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useManualOnboardAgent } from "../mutations/agent.mutation";
import type { ManualOnboardAgentResult } from "../types/agent.types";
import { buildServiceAreaSelectOptions } from "../utils/buildServiceAreaSelectOptions";
import { formatManualOnboardServiceArea } from "../utils/formatManualOnboardServiceArea";
import {
  validateFullNameValue,
  validateInviteEmailValue,
  validatePhoneValue,
  validateServiceAreaValues,
} from "../utils/validateOnboardAgentForms";

type ManualFormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  serviceArea?: string;
};

const EMPTY_MANUAL_FORM_ERRORS: ManualFormErrors = {};

export function useManualOnboardAgentModal() {
  const t = useTranslations("user.agents.manualOnboardModal");
  const tValidation = useTranslations("user.agents.manualOnboardModal.validation");
  const tAuth = useTranslations("auth");
  const toast = useToast();
  const {
    mutateAsync: submitManualOnboard,
    reset: resetManualOnboardMutation,
    isPending: isSubmitting,
  } = useManualOnboardAgent();

  const locationTaxonomy = usePropertyStore((state) => state.locationTaxonomy);
  const { mutate: getLocationTaxonomy, isPending: isLocationTaxonomyLoading } =
    useGetLocationTaxonomy();

  const [isOpen, setIsOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("JO");
  const [phoneNationalNumber, setPhoneNationalNumber] = useState("");
  const [serviceAreaValues, setServiceAreaValues] = useState<string[]>([]);
  const [errors, setErrors] = useState<ManualFormErrors>(EMPTY_MANUAL_FORM_ERRORS);
  const [onboardResult, setOnboardResult] = useState<ManualOnboardAgentResult | null>(
    null,
  );

  const hasSubmittedSuccessfully = onboardResult !== null;
  const wasOpenRef = useRef(false);

  const serviceAreaOptions = useMemo(
    () => buildServiceAreaSelectOptions(locationTaxonomy ?? undefined),
    [locationTaxonomy],
  );

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  }, [isSubmitting]);

  const resolveEmailErrorMessage = useCallback(
    (error: "required" | "invalid" | null) => {
      if (error === "required") {
        return tAuth("signUpEmailRequired");
      }

      if (error === "invalid") {
        return tAuth("signUpEmailInvalid");
      }

      return undefined;
    },
    [tAuth],
  );

  const onFullNameChange = useCallback(
    (value: string) => {
      if (hasSubmittedSuccessfully) {
        return;
      }

      setFullName(value);
      setErrors((previous) => ({ ...previous, fullName: undefined }));
    },
    [hasSubmittedSuccessfully],
  );

  const onEmailChange = useCallback(
    (value: string) => {
      if (hasSubmittedSuccessfully) {
        return;
      }

      setEmail(value);
      setErrors((previous) => ({ ...previous, email: undefined }));
    },
    [hasSubmittedSuccessfully],
  );

  const onPhoneCountryChange = useCallback(
    (value: string) => {
      if (hasSubmittedSuccessfully) {
        return;
      }

      setPhoneCountryCode(value);
      setErrors((previous) => ({ ...previous, phone: undefined }));
    },
    [hasSubmittedSuccessfully],
  );

  const onPhoneNationalNumberChange = useCallback(
    (value: string) => {
      if (hasSubmittedSuccessfully) {
        return;
      }

      setPhoneNationalNumber(value);
      setErrors((previous) => ({ ...previous, phone: undefined }));
    },
    [hasSubmittedSuccessfully],
  );

  const onServiceAreaChange = useCallback(
    (values: string[]) => {
      if (hasSubmittedSuccessfully) {
        return;
      }

      setServiceAreaValues(values);
      setErrors((previous) => ({ ...previous, serviceArea: undefined }));
    },
    [hasSubmittedSuccessfully],
  );

  const onSubmit = useCallback(async () => {
    if (isSubmitting || hasSubmittedSuccessfully) {
      return;
    }

    const country = getPhoneInputCountryByCode(phoneCountryCode);
    const e164Phone = country
      ? formatPhoneNumberE164(country.dialCode, phoneNationalNumber)
      : "";

    const nextErrors: ManualFormErrors = {
      fullName:
        validateFullNameValue(fullName) != null
          ? tValidation("fullNameRequired")
          : undefined,
      email: resolveEmailErrorMessage(validateInviteEmailValue(email)),
      phone:
        validatePhoneValue(phoneNationalNumber, e164Phone) === "required"
          ? tAuth("signUpPhoneRequired")
          : validatePhoneValue(phoneNationalNumber, e164Phone) === "invalid"
            ? tAuth("signUpPhoneInvalid")
            : undefined,
      serviceArea:
        validateServiceAreaValues(serviceAreaValues) != null
          ? tValidation("serviceAreaRequired")
          : undefined,
    };

    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors);
      return;
    }

    setErrors(EMPTY_MANUAL_FORM_ERRORS);

    try {
      const result = await submitManualOnboard({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: e164Phone,
        serviceArea: formatManualOnboardServiceArea(
          serviceAreaValues,
          serviceAreaOptions,
        ),
      });
      setOnboardResult(result);
    } catch {
      // Error toast handled in mutation.
    }
  }, [
    email,
    fullName,
    hasSubmittedSuccessfully,
    isSubmitting,
    phoneCountryCode,
    phoneNationalNumber,
    resolveEmailErrorMessage,
    serviceAreaOptions,
    serviceAreaValues,
    submitManualOnboard,
    tAuth,
    tValidation,
  ]);

  const onCopyPassword = useCallback(async () => {
    const temporaryPassword = onboardResult?.agent.temporaryPassword;

    if (!temporaryPassword) {
      return;
    }

    try {
      await navigator.clipboard.writeText(temporaryPassword);
      toast.success(t("success.copyPasswordSuccessTitle"), {
        description: t("success.copyPasswordSuccessDescription"),
      });
    } catch {
      toast.error(t("success.copyPasswordErrorTitle"), {
        description: t("success.copyPasswordErrorDescription"),
      });
    }
  }, [onboardResult?.agent.temporaryPassword, t, toast]);

  const onCopySetupLink = useCallback(async () => {
    const setupLink = onboardResult?.agent.inviteLink;

    if (!setupLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(setupLink);
      toast.success(t("success.copySetupLinkSuccessTitle"), {
        description: t("success.copySetupLinkSuccessDescription"),
      });
    } catch {
      toast.error(t("success.copySetupLinkErrorTitle"), {
        description: t("success.copySetupLinkErrorDescription"),
      });
    }
  }, [onboardResult?.agent.inviteLink, t, toast]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      setFullName("");
      setEmail("");
      setPhoneCountryCode("JO");
      setPhoneNationalNumber("");
      setServiceAreaValues([]);
      setErrors(EMPTY_MANUAL_FORM_ERRORS);
      setOnboardResult(null);
      resetManualOnboardMutation();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, resetManualOnboardMutation]);

  useEffect(() => {
    if (!isOpen || locationTaxonomy != null) {
      return;
    }

    getLocationTaxonomy();
  }, [getLocationTaxonomy, isOpen, locationTaxonomy]);

  const successMessage =
    onboardResult?.message ||
    (onboardResult
      ? t("success.descriptionWithName", {
          name: onboardResult.agent.fullName,
        })
      : "");

  return {
    isOpen,
    openModal,
    closeModal,
    title: t("title"),
    description: hasSubmittedSuccessfully
      ? t("success.subtitle")
      : t("description"),
    cancelLabel: t("cancel"),
    primaryActionLabel: hasSubmittedSuccessfully ? t("success.done") : t("submit"),
    submittingLabel: t("submitting"),
    isSubmitting,
    hasSubmittedSuccessfully,
    onPrimaryAction: hasSubmittedSuccessfully ? closeModal : onSubmit,
    content: {
      fullName,
      email,
      phoneCountryCode,
      phoneNationalNumber,
      serviceAreaValues,
      serviceAreaOptions,
      fullNameLabel: t("fullNameLabel"),
      fullNamePlaceholder: t("fullNamePlaceholder"),
      emailLabel: t("emailLabel"),
      emailPlaceholder: t("emailPlaceholder"),
      phoneLabel: t("phoneLabel"),
      phonePlaceholder: tAuth("signUpPhonePlaceholder"),
      phoneSearchPlaceholder: tAuth("signUpPhoneSearchPlaceholder"),
      phoneEmptySearchLabel: tAuth("signUpPhoneNoMatches"),
      serviceAreaLabel: t("serviceAreaLabel"),
      serviceAreaPlaceholder: t("serviceAreaPlaceholder"),
      fullNameError: errors.fullName,
      emailError: errors.email,
      phoneError: errors.phone,
      serviceAreaError: errors.serviceArea,
      disabled: isSubmitting,
      isServiceAreaLoading: isLocationTaxonomyLoading && serviceAreaOptions.length === 0,
      onFullNameChange,
      onEmailChange,
      onPhoneCountryChange,
      onPhoneNationalNumberChange,
      onServiceAreaChange,
      hasSubmittedSuccessfully,
      success: onboardResult
        ? {
            readyTitle: t("success.readyTitle"),
            successMessage,
            passwordLabel: t("success.temporaryPasswordLabel"),
            temporaryPassword: onboardResult.agent.temporaryPassword,
            copyPasswordLabel: t("success.copyPassword"),
            setupLinkLabel: t("success.setupLinkLabel"),
            setupLink: onboardResult.agent.inviteLink,
            copySetupLinkLabel: t("success.copySetupLink"),
            passwordHint: t("success.passwordHint"),
            onCopyPassword,
            onCopySetupLink,
          }
        : null,
    },
  };
}

export type UseManualOnboardAgentModalReturn = ReturnType<
  typeof useManualOnboardAgentModal
>;
