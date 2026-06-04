"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef, type ChangeEvent } from "react";
import { useToast } from "@/src/hooks/useToast";
import {
  useDeleteAgencyLogo,
  useUploadAgencyLogo,
} from "../mutations/profile.mutation";
import { validateProfileImageFile } from "../utils/validateProfileImageFile";

export function useAgencyLogoUpload(agencyId: string) {
  const t = useTranslations("profile");
  const toast = useToast();
  const canUpload = agencyId.trim().length > 0;

  const { mutate: uploadLogo, isPending: isUploading } = useUploadAgencyLogo(agencyId);
  const { mutate: removeLogo, isPending: isRemoving } = useDeleteAgencyLogo(agencyId);

  const isBusy = isUploading || isRemoving;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadClick = useCallback(() => {
    if (!canUpload || isBusy) return;
    fileInputRef.current?.click();
  }, [canUpload, isBusy]);

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !canUpload) return;

      const validationError = validateProfileImageFile(file, {
        invalidType: t("uploadAgencyLogoInvalidType"),
        tooLarge: t("uploadAgencyLogoTooLarge"),
      });

      if (validationError) {
        toast.error(t("uploadAgencyLogoErrorTitle"), {
          description: validationError,
        });
        return;
      }

      uploadLogo(file);
    },
    [canUpload, t, toast, uploadLogo],
  );

  const onRemoveClick = useCallback(() => {
    if (!canUpload || isBusy) return;
    removeLogo();
  }, [canUpload, isBusy, removeLogo]);

  return {
    fileInputRef,
    onUploadClick,
    onFileChange,
    onRemoveClick,
    isUploading,
    isRemoving,
    isBusy,
    uploadingLabel: t("uploadAgencyLogoLoading"),
    removingLabel: t("removeAgencyLogoLoading"),
  };
}
