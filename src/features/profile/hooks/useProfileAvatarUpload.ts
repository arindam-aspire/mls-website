"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef, type ChangeEvent } from "react";
import { useToast } from "@/src/hooks/useToast";
import {
  useDeleteProfilePicture,
  useUploadProfilePicture,
} from "../mutations/profile.mutation";
import { validateProfileImageFile } from "../utils/validateProfileImageFile";

export function useProfileAvatarUpload() {
  // 2. UI utilities
  const t = useTranslations("profile");
  const toast = useToast();

  // 5. Data fetching / queries
  const { mutate: uploadPhoto, isPending: isUploading } = useUploadProfilePicture();
  const { mutate: removePhoto, isPending: isRemoving } = useDeleteProfilePicture();

  // 6. Derived / memoized values
  const isBusy = isUploading || isRemoving;

  // 8. Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 7. Callbacks
  const onUploadClick = useCallback(() => {
    if (isBusy) return;
    fileInputRef.current?.click();
  }, [isBusy, fileInputRef]);

  const onFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;

      const validationError = validateProfileImageFile(file, {
        invalidType: t("uploadProfilePhotoInvalidType"),
        tooLarge: t("uploadProfilePhotoTooLarge"),
      });

      if (validationError) {
        toast.error(t("uploadProfilePhotoErrorTitle"), {
          description: validationError,
        });
        return;
      }

      uploadPhoto(file);
    },
    [t, toast, uploadPhoto],
  );

  const onRemoveClick = useCallback(() => {
    if (isBusy) return;
    removePhoto();
  }, [isBusy, removePhoto]);

  // 10. Return values
  return {
    fileInputRef,
    onUploadClick,
    onFileChange,
    onRemoveClick,
    isUploading,
    isRemoving,
    isBusy,
    uploadingLabel: t("uploadProfilePhotoLoading"),
    removingLabel: t("removeProfilePhotoLoading"),
  };
}
