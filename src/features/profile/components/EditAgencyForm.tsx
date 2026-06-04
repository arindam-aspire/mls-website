"use client";



import type { ComponentProps, FormEventHandler } from "react";

import {

  Building2,

  Globe,

  MapPin,

  Save,

} from "lucide-react";

import { LicenseDocumentUpload } from "@/src/components/common/LicenseDocumentUpload";

import { Button, Input } from "@/src/components/ui";

import type { EditAgencyFormValues, EditAgencyLicenseUploadProps } from "../types/profile.types";



export const EDIT_AGENCY_FORM_ID = "edit-agency-form";



export type EditAgencyFormProps = {

  values: EditAgencyFormValues;

  errors: Partial<Record<keyof EditAgencyFormValues, string>>;

  labels: {

    agencyName: string;

    tradeName: string;

    website: string;

    address: string;

    city: string;

    state: string;

    country: string;

    zipCode: string;

    submit: string;

    loading: string;

  };

  licenseUpload: EditAgencyLicenseUploadProps;

  onChange: ComponentProps<typeof Input>["onChange"];

  onBlur: ComponentProps<typeof Input>["onBlur"];

  onFormSubmit: FormEventHandler<HTMLFormElement>;

  isLoading?: boolean;

  isSubmitDisabled?: boolean;

  /** When true, omits the inline submit button (use `ModalFooter` + `form` attribute). */

  hideSubmitButton?: boolean;

};



export function EditAgencyForm({

  values,

  errors,

  labels,

  licenseUpload,

  onChange,

  onBlur,

  onFormSubmit,

  isLoading = false,

  isSubmitDisabled = false,

  hideSubmitButton = false,

}: EditAgencyFormProps) {

  return (

    <form

      id={EDIT_AGENCY_FORM_ID}

      noValidate

      onSubmit={onFormSubmit}

      className="flex flex-col gap-3"

    >

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

        <Input

          name="agency_name"

          type="text"

          size="md"

          label={labels.agencyName}

          value={values.agency_name}

          onChange={onChange}

          onBlur={onBlur}

          error={errors.agency_name}

          iconStart={<Building2 className="size-4" aria-hidden />}

          isRequired

          className="lg:col-span-2"

        />

        <Input

          name="agency_trade_name"

          type="text"

          size="md"

          label={labels.tradeName}

          value={values.agency_trade_name}

          onChange={onChange}

          onBlur={onBlur}

          error={errors.agency_trade_name}

          iconStart={<Building2 className="size-4" aria-hidden />}

          isRequired

          className="lg:col-span-2"

        />

        <LicenseDocumentUpload

          variant="compact"

          className="sm:col-span-2 lg:col-span-2"

          label={licenseUpload.label}

          uploadPrompt={licenseUpload.uploadPrompt}

          uploadHint={licenseUpload.uploadHint}

          selectedFileName={licenseUpload.selectedFileName}

          onFileSelect={licenseUpload.onFileSelect}

          error={licenseUpload.error}

          isUploading={licenseUpload.isUploading}

          uploadingLabel={licenseUpload.uploadingLabel}

          disabled={licenseUpload.disabled}

        />

        <Input

          name="website"

          type="url"

          size="md"

          label={labels.website}

          value={values.website}

          onChange={onChange}

          onBlur={onBlur}

          error={errors.website}

          iconStart={<Globe className="size-4" aria-hidden />}

          className="sm:col-span-2 lg:col-span-2"

        />

        <Input

          name="address"

          type="text"

          size="md"

          label={labels.address}

          value={values.address}

          onChange={onChange}

          onBlur={onBlur}

          error={errors.address}

          iconStart={<MapPin className="size-4" aria-hidden />}

          className="sm:col-span-2 lg:col-span-4"

        />

        <Input

          name="city"

          type="text"

          size="md"

          label={labels.city}

          value={values.city}

          onChange={onChange}

          onBlur={onBlur}

          error={errors.city}

        />

        <Input

          name="state"

          type="text"

          size="md"

          label={labels.state}

          value={values.state}

          onChange={onChange}

          onBlur={onBlur}

          error={errors.state}

        />

        <Input

          name="country"

          type="text"

          size="md"

          label={labels.country}

          value={values.country}

          onChange={onChange}

          onBlur={onBlur}

          error={errors.country}

        />

        <Input

          name="zip_code"

          type="text"

          size="md"

          label={labels.zipCode}

          value={values.zip_code}

          onChange={onChange}

          onBlur={onBlur}

          error={errors.zip_code}

        />

      </div>



      {hideSubmitButton ? null : (

        <Button

          type="submit"

          color="primary"

          size="md"

          fullWidth

          className="rounded-lg font-semibold"

          isLoading={isLoading}

          loadingLabel={labels.loading}

          disabled={isSubmitDisabled || isLoading}

          iconStart={<Save className="size-4" aria-hidden />}

        >

          {labels.submit}

        </Button>

      )}

    </form>

  );

}


