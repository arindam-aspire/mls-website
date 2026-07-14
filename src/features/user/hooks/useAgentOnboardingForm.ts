"use client";

import { useGetLocationTaxonomy } from "@/src/features/landing/mutations/landing.mutation";
import { formatPhoneNumberE164 } from "@/src/features/profile/utils/formatPhoneNumberE164";
import { usePropertyStore } from "@/src/features/property/store/property.store";
import { getPhoneInputCountryByCode } from "@/src/components/ui/phone-input/countries";
import { useToast } from "@/src/hooks/useToast";
import { validateIdentityDocumentFile } from "@/src/lib/validateIdentityDocumentFile";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { uploadAgentIdentityDocument } from "../services/agentUpload.service";
import { buildServiceAreaSelectOptions } from "../utils/buildServiceAreaSelectOptions";
import { formatManualOnboardServiceArea } from "../utils/formatManualOnboardServiceArea";
import {
  validateFullNameValue,
  validateInviteEmailValue,
  validatePhoneValue,
  validateServiceAreaValues,
  validateWhatsAppValue,
} from "../utils/validateOnboardAgentForms";

export type AgentOnboardingFormState = {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNationalNumber: string;
  whatsappCountryCode: string;
  whatsappNationalNumber: string;
  serviceAreaValues: string[];
  position: string;
  /** Signed read URL for preview/download (not a public URL). */
  identityDocumentUrl: string | null;
  /** S3 object key / file reference for onboarding submission. */
  identityDocumentObjectKey: string | null;
  identityDocumentFileName: string | null;
};

export type AgentOnboardingFormErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
  whatsappNumber?: string;
  serviceArea?: string;
  position?: string;
  identityDocument?: string;
};

const EMPTY_AGENT_ONBOARDING_FORM_ERRORS: AgentOnboardingFormErrors = {};

export function createEmptyAgentOnboardingFormState(): AgentOnboardingFormState {
  return {
    fullName: "",
    email: "",
    phoneCountryCode: "JO",
    phoneNationalNumber: "",
    whatsappCountryCode: "JO",
    whatsappNationalNumber: "",
    serviceAreaValues: [],
    position: "",
    identityDocumentUrl: null,
    identityDocumentObjectKey: null,
    identityDocumentFileName: null,
  };
}

type UseAgentOnboardingFormParams = {
  disabled?: boolean;
  invitationToken?: string;
  initialValues?: Partial<AgentOnboardingFormState>;
};

export function useAgentOnboardingForm({
  disabled = false,
  invitationToken,
  initialValues,
}: UseAgentOnboardingFormParams = {}) {
  const t = useTranslations("user.agents.onboardingForm");
  const tValidation = useTranslations("user.agents.onboardingForm.validation");
  const tAuth = useTranslations("auth");
  const toast = useToast();

  const locationTaxonomy = usePropertyStore((state) => state.locationTaxonomy);
  const { mutate: getLocationTaxonomy, isPending: isLocationTaxonomyLoading } =
    useGetLocationTaxonomy();

  const [formState, setFormState] = useState<AgentOnboardingFormState>(() => ({
    ...createEmptyAgentOnboardingFormState(),
    ...initialValues,
  }));
  const [errors, setErrors] = useState<AgentOnboardingFormErrors>(
    EMPTY_AGENT_ONBOARDING_FORM_ERRORS,
  );
  const [isIdentityDocumentUploading, setIsIdentityDocumentUploading] = useState(false);

  const serviceAreaOptions = useMemo(
    () => buildServiceAreaSelectOptions(locationTaxonomy ?? undefined),
    [locationTaxonomy],
  );

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

  const clearFieldError = useCallback((field: keyof AgentOnboardingFormErrors) => {
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }, []);

  const onFullNameChange = useCallback(
    (value: string) => {
      if (disabled) return;
      setFormState((previous) => ({ ...previous, fullName: value }));
      clearFieldError("fullName");
    },
    [clearFieldError, disabled],
  );

  const onEmailChange = useCallback(
    (value: string) => {
      if (disabled || invitationToken) {
        return;
      }
      setFormState((previous) => ({ ...previous, email: value }));
      clearFieldError("email");
    },
    [clearFieldError, disabled, invitationToken],
  );

  const onPhoneCountryChange = useCallback(
    (value: string) => {
      if (disabled) return;
      setFormState((previous) => ({ ...previous, phoneCountryCode: value }));
      clearFieldError("phone");
    },
    [clearFieldError, disabled],
  );

  const onPhoneNationalNumberChange = useCallback(
    (value: string) => {
      if (disabled) return;
      setFormState((previous) => ({ ...previous, phoneNationalNumber: value }));
      clearFieldError("phone");
    },
    [clearFieldError, disabled],
  );

  const onWhatsappCountryChange = useCallback(
    (value: string) => {
      if (disabled) return;
      setFormState((previous) => ({ ...previous, whatsappCountryCode: value }));
      clearFieldError("whatsappNumber");
    },
    [clearFieldError, disabled],
  );

  const onWhatsappNationalNumberChange = useCallback(
    (value: string) => {
      if (disabled) return;
      setFormState((previous) => ({ ...previous, whatsappNationalNumber: value }));
      clearFieldError("whatsappNumber");
    },
    [clearFieldError, disabled],
  );

  const onServiceAreaChange = useCallback(
    (values: string[]) => {
      if (disabled) return;
      setFormState((previous) => ({ ...previous, serviceAreaValues: values }));
      clearFieldError("serviceArea");
    },
    [clearFieldError, disabled],
  );

  const onPositionChange = useCallback(
    (value: string) => {
      if (disabled) return;
      setFormState((previous) => ({ ...previous, position: value }));
      clearFieldError("position");
    },
    [clearFieldError, disabled],
  );

  const onIdentityDocumentSelect = useCallback(
    async (file: File) => {
      if (disabled || isIdentityDocumentUploading) {
        return;
      }

      const validationError = validateIdentityDocumentFile(file, {
        invalidType: tValidation("identityDocumentInvalidType"),
        tooLarge: tValidation("identityDocumentTooLarge"),
      });

      if (validationError) {
        setErrors((previous) => ({
          ...previous,
          identityDocument: validationError,
        }));
        return;
      }

      clearFieldError("identityDocument");

      try {
        setIsIdentityDocumentUploading(true);
        const uploaded = await uploadAgentIdentityDocument(file, invitationToken);
        setFormState((previous) => ({
          ...previous,
          identityDocumentUrl: uploaded.signedReadUrl,
          identityDocumentObjectKey: uploaded.objectKey,
          identityDocumentFileName: file.name,
        }));
      } catch (error) {
        toast.error(tValidation("identityDocumentUploadError"), {
          description: error instanceof Error ? error.message : undefined,
        });
      } finally {
        setIsIdentityDocumentUploading(false);
      }
    },
    [
      clearFieldError,
      disabled,
      invitationToken,
      isIdentityDocumentUploading,
      tValidation,
      toast,
    ],
  );

  const validateForm = useCallback((): AgentOnboardingFormErrors => {
    const phoneCountry = getPhoneInputCountryByCode(formState.phoneCountryCode);
    const whatsappCountry = getPhoneInputCountryByCode(formState.whatsappCountryCode);
    const e164Phone = phoneCountry
      ? formatPhoneNumberE164(phoneCountry.dialCode, formState.phoneNationalNumber)
      : "";
    const e164Whatsapp = whatsappCountry
      ? formatPhoneNumberE164(whatsappCountry.dialCode, formState.whatsappNationalNumber)
      : "";

    const fullNameError = validateFullNameValue(formState.fullName);
    const nextErrors: AgentOnboardingFormErrors = {
      fullName:
        fullNameError === "required"
          ? tValidation("fullNameRequired")
          : fullNameError === "tooShort"
            ? tValidation("fullNameTooShort")
            : undefined,
      email: resolveEmailErrorMessage(validateInviteEmailValue(formState.email)),
      phone:
        validatePhoneValue(formState.phoneNationalNumber, e164Phone) === "required"
          ? tAuth("signUpPhoneRequired")
          : validatePhoneValue(formState.phoneNationalNumber, e164Phone) === "invalid"
            ? tAuth("signUpPhoneInvalid")
            : undefined,
      whatsappNumber:
        validateWhatsAppValue(formState.whatsappNationalNumber, e164Whatsapp) === "invalid"
          ? tValidation("whatsappInvalid")
          : undefined,
      serviceArea:
        validateServiceAreaValues(formState.serviceAreaValues) != null
          ? tValidation("serviceAreaRequired")
          : undefined,
    };

    return nextErrors;
  }, [formState, resolveEmailErrorMessage, tAuth, tValidation]);

  const buildSubmitPayload = useCallback(() => {
    const phoneCountry = getPhoneInputCountryByCode(formState.phoneCountryCode);
    const whatsappCountry = getPhoneInputCountryByCode(formState.whatsappCountryCode);
    const e164Phone = phoneCountry
      ? formatPhoneNumberE164(phoneCountry.dialCode, formState.phoneNationalNumber)
      : "";
    const e164Whatsapp = whatsappCountry
      ? formatPhoneNumberE164(whatsappCountry.dialCode, formState.whatsappNationalNumber)
      : "";

    const identityDocument =
      formState.identityDocumentObjectKey?.trim() ||
      formState.identityDocumentUrl?.trim() ||
      "";

    return {
      fullName: formState.fullName.trim(),
      email: formState.email.trim(),
      phone: e164Phone,
      whatsappNumber: e164Whatsapp || undefined,
      serviceArea: formatManualOnboardServiceArea(
        formState.serviceAreaValues,
        serviceAreaOptions,
      ),
      position: formState.position.trim(),
      identityDocument,
    };
  }, [formState, serviceAreaOptions]);

  const setFieldErrors = useCallback((nextErrors: AgentOnboardingFormErrors) => {
    setErrors(nextErrors);
  }, []);

  const resetForm = useCallback(() => {
    setFormState(createEmptyAgentOnboardingFormState());
    setErrors(EMPTY_AGENT_ONBOARDING_FORM_ERRORS);
  }, []);

  const hydrateForm = useCallback((values: Partial<AgentOnboardingFormState>) => {
    setFormState((previous) => ({
      ...previous,
      ...values,
    }));
  }, []);

  useEffect(() => {
    if (locationTaxonomy != null) {
      return;
    }

    getLocationTaxonomy();
  }, [getLocationTaxonomy, locationTaxonomy]);

  return {
    formState,
    errors,
    serviceAreaOptions,
    isServiceAreaLoading: isLocationTaxonomyLoading && serviceAreaOptions.length === 0,
    isIdentityDocumentUploading,
    isEmailReadOnly: Boolean(invitationToken),
    labels: {
      fullNameLabel: t("fullNameLabel"),
      fullNamePlaceholder: t("fullNamePlaceholder"),
      emailLabel: t("emailLabel"),
      emailPlaceholder: t("emailPlaceholder"),
      phoneLabel: t("phoneLabel"),
      phonePlaceholder: tAuth("signUpPhonePlaceholder"),
      phoneSearchPlaceholder: tAuth("signUpPhoneSearchPlaceholder"),
      phoneEmptySearchLabel: tAuth("signUpPhoneNoMatches"),
      whatsappLabel: t("whatsappLabel"),
      whatsappPlaceholder: t("whatsappPlaceholder"),
      serviceAreaLabel: t("serviceAreaLabel"),
      serviceAreaPlaceholder: t("serviceAreaPlaceholder"),
      positionLabel: t("positionLabel"),
      positionPlaceholder: t("positionPlaceholder"),
      identityDocumentLabel: t("identityDocumentLabel"),
      identityDocumentUploadPrompt: t("identityDocumentUploadPrompt"),
      identityDocumentUploadHint: t("identityDocumentUploadHint"),
      identityDocumentUploadingLabel: t("identityDocumentUploading"),
    },
    handlers: {
      onFullNameChange,
      onEmailChange,
      onPhoneCountryChange,
      onPhoneNationalNumberChange,
      onWhatsappCountryChange,
      onWhatsappNationalNumberChange,
      onServiceAreaChange,
      onPositionChange,
      onIdentityDocumentSelect,
    },
    validateForm,
    buildSubmitPayload,
    setFieldErrors,
    resetForm,
    hydrateForm,
  };
}
