"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, type ChangeEvent } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import { cacheProfilePictureFile } from "@/src/lib/profilePictureCache";
import { isUsableNextImageSrc } from "@/src/lib/shouldUnoptimizeImageSrc";
import {
  useDeleteProfilePicture,
  useUploadProfilePicture,
} from "../mutations/profile.mutation";
import { validateProfileImageFile } from "../utils/validateProfileImageFile";

export function useProfileAvatarUpload() {
  // 2. UI utilities
  const t = useTranslations("profile");
  const toast = useToast();

  // 3. Global state
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  // 5. Data fetching / queries
  const { mutate: uploadPhoto, isPending: isUploading } = useUploadProfilePicture();
  const { mutate: removePhoto, isPending: isRemoving } = useDeleteProfilePicture();

  // 6. Derived / memoized values
  const isBusy = isUploading || isRemoving;

  // 8. Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewObjectUrlRef = useRef<string | null>(null);

  const releasePreviewObjectUrl = useCallback(() => {
    if (!previewObjectUrlRef.current) return;
    URL.revokeObjectURL(previewObjectUrlRef.current);
    previewObjectUrlRef.current = null;
  }, []);

  // 7. Callbacks
  const onUploadClick = useCallback(() => {
    if (isBusy) return;
    fileInputRef.current?.click();
  }, [isBusy]);

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

      const previousUrl = user?.profile_picture_url ?? null;
      releasePreviewObjectUrl();
      const previewUrl = URL.createObjectURL(file);
      previewObjectUrlRef.current = previewUrl;

      if (user) {
        setUser({ ...user, profile_picture_url: previewUrl });
        void cacheProfilePictureFile(user.id, file);
      }

      uploadPhoto(file, {
        onSuccess: (updated) => {
          if (isUsableNextImageSrc(updated.profile_picture_url)) {
            releasePreviewObjectUrl();
          }
        },
        onError: () => {
          releasePreviewObjectUrl();
          const current = useAuthStore.getState().user;
          if (current) {
            setUser({ ...current, profile_picture_url: previousUrl });
          }
        },
      });
    },
    [releasePreviewObjectUrl, setUser, t, toast, uploadPhoto, user],
  );

  const onRemoveClick = useCallback(() => {
    if (isBusy) return;
    removePhoto(undefined, {
      onSuccess: () => {
        releasePreviewObjectUrl();
      },
    });
  }, [isBusy, releasePreviewObjectUrl, removePhoto]);

  // 9. Effects
  useEffect(
    () => () => {
      const storedUrl = useAuthStore.getState().user?.profile_picture_url;
      if (
        previewObjectUrlRef.current &&
        previewObjectUrlRef.current !== storedUrl
      ) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
        previewObjectUrlRef.current = null;
      }
    },
    [],
  );

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
