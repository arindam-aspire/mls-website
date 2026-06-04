"use client";

import { useTranslations } from "next-intl";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { validateLicenseDocumentFile } from "@/src/lib/validateLicenseDocumentFile";
import { useForm } from "@/src/hooks/useForm";
import {
  useUpdateAgency,
  useUploadAgencyLegalDocument,
} from "../mutations/profile.mutation";
import type { Agency, EditAgencyFormValues } from "../types/profile.types";
import {
  agencyToEditFormValues,
  editFormValuesToChangedUpdateAgencyRequest,
  hasUpdateAgencyRequestChanges,
  isValidOptionalUrl,
} from "../utils/agencyForm.utils";
import { licenseDocumentDisplayName } from "../utils/licenseDocumentDisplay";

type UseEditAgencyModalParams = {
  agencyId: string;
  agency: Agency | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const emptyFormValues: EditAgencyFormValues = {
  agency_name: "",
  agency_trade_name: "",
  website: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
};

export function useEditAgencyModal({
  agencyId,
  agency,
  isOpen,
  setIsOpen,
}: UseEditAgencyModalParams) {
  const t = useTranslations("profile");
  const canSubmit = agencyId.trim().length > 0;

  const { mutate: updateAgencyMutation, isPending: isUpdatingAgency } =
    useUpdateAgency(agencyId);
  const { mutate: uploadLegalDocumentMutation, isPending: isUploadingLicense } =
    useUploadAgencyLegalDocument(agencyId);

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [licenseError, setLicenseError] = useState<string | undefined>();

  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useForm<EditAgencyFormValues>({
    initialValues: emptyFormValues,
    validate: (formValues) => {
      const nextErrors: Partial<Record<keyof EditAgencyFormValues, string>> = {};

      if (!formValues.agency_name.trim()) {
        nextErrors.agency_name = t("editAgencyFieldRequired");
      }
      if (!formValues.agency_trade_name.trim()) {
        nextErrors.agency_trade_name = t("editAgencyFieldRequired");
      }
      if (!isValidOptionalUrl(formValues.website)) {
        nextErrors.website = t("editAgencyInvalidUrl");
      }

      return nextErrors;
    },
  });

  const existingLicenseFileName = useMemo(() => {
    if (!agency) return null;
    return licenseDocumentDisplayName(
      agency.legal_document_s3_link,
      t("licenseNotProvided"),
    );
  }, [agency, t]);

  const licenseSelectedFileName = licenseFile?.name ?? existingLicenseFileName;

  useEffect(() => {
    if (!isOpen || !agency) return;
    setValues(agencyToEditFormValues(agency));
    setLicenseFile(null);
    setLicenseError(undefined);
  }, [agency, isOpen, setValues]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onLicenseFileSelect = useCallback(
    (file: File) => {
      const validationError = validateLicenseDocumentFile(file, {
        invalidType: t("uploadAgencyLicenseInvalidType"),
        tooLarge: t("uploadAgencyLicenseTooLarge"),
      });

      if (validationError) {
        setLicenseFile(null);
        setLicenseError(validationError);
        return;
      }

      setLicenseFile(file);
      setLicenseError(undefined);
    },
    [t],
  );

  const finishSave = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const onFormSubmit = handleSubmit((formValues) => {
    if (!canSubmit || !agency) return;

    const fileToUpload = licenseFile;
    const changedFields = editFormValuesToChangedUpdateAgencyRequest(agency, formValues);
    const hasFieldChanges = hasUpdateAgencyRequestChanges(changedFields);

    if (!hasFieldChanges && !fileToUpload) {
      finishSave();
      return;
    }

    const uploadLicenseAfterSave = () => {
      if (!fileToUpload) {
        finishSave();
        return;
      }

      uploadLegalDocumentMutation(fileToUpload, {
        onSuccess: finishSave,
      });
    };

    if (hasFieldChanges) {
      updateAgencyMutation(changedFields, {
        onSuccess: uploadLicenseAfterSave,
      });
      return;
    }

    uploadLicenseAfterSave();
  });

  const isSubmitting = isUpdatingAgency || isUploadingLicense;

  return {
    title: t("editAgencyModalTitle"),
    description: t("editAgencyModalDescription"),
    isSubmitting,
    isSubmitDisabled: !canSubmit || !agency,
    closeModal,
    formProps: {
      values,
      errors,
      labels: {
        agencyName: t("agencyNameLabel"),
        tradeName: t("tradeNameLabel"),
        website: t("websiteLabel"),
        address: t("addressLabel"),
        city: t("cityLabel"),
        state: t("stateLabel"),
        country: t("countryLabel"),
        zipCode: t("zipCodeLabel"),
        submit: t("saveAgencyChanges"),
        loading: t("saveAgencyChangesLoading"),
      },
      licenseUpload: {
        label: t("licenseLabel"),
        uploadPrompt: t("licenseUploadPrompt"),
        uploadHint: t("licenseUploadHint"),
        selectedFileName: licenseSelectedFileName,
        onFileSelect: onLicenseFileSelect,
        error: licenseError,
        isUploading: isUploadingLicense,
        uploadingLabel: t("uploadAgencyLicenseLoading"),
        disabled: isSubmitting,
      },
      onChange: handleChange,
      onBlur: handleBlur,
      onFormSubmit,
      isLoading: isSubmitting,
      isSubmitDisabled: !canSubmit || !agency,
    },
  };
};
