"use client";

import {
  uploadPropertyDocument,
  uploadPropertyMediaImage,
} from "@/src/features/property/services/upload.service";
import { useToast } from "@/src/hooks/useToast";
import { validateOwnerDocumentFile } from "@/src/lib/validateOwnerDocumentFile";
import { validatePropertyMediaImageFile } from "@/src/lib/validatePropertyMediaImageFile";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

export function usePropertyMediaUpload(submissionId: string | null) {
  // 2. UI utilities
  const t = useTranslations("propertyList.propertyCreate");
  const toast = useToast();

  // 8. Refs
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const submissionIdRef = useRef(submissionId);
  submissionIdRef.current = submissionId;

  // 7. Callbacks
  const ensureSubmissionId = useCallback((): string | null => {
    if (submissionIdRef.current) {
      return submissionIdRef.current;
    }

    toastRef.current.error(t("propertyMediaUploadRequiresDraft"), {
      description: t("propertyMediaUploadRequiresDraftDescription"),
    });
    return null;
  }, [t]);

  const onUploadPropertyMedia = useCallback(
    async (file: File) => {
      const activeSubmissionId = ensureSubmissionId();
      if (!activeSubmissionId) {
        return null;
      }

      const validationError = validatePropertyMediaImageFile(file, {
        invalidType: t("propertyMediaUploadInvalidType"),
        tooLarge: t("propertyMediaUploadTooLarge"),
      });

      if (validationError) {
        toastRef.current.error(t("propertyMediaUploadError"), {
          description: validationError,
        });
        return null;
      }

      try {
        return await uploadPropertyMediaImage(file, activeSubmissionId);
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        toastRef.current.error(t("propertyMediaUploadError"), { description: message });
        return null;
      }
    },
    [ensureSubmissionId, t],
  );

  const onUploadPropertyDocument = useCallback(
    async (file: File) => {
      const activeSubmissionId = ensureSubmissionId();
      if (!activeSubmissionId) {
        return null;
      }

      const validationError = validateOwnerDocumentFile(file, {
        invalidType: t("propertyDocumentUploadInvalidType"),
        tooLarge: t("propertyDocumentUploadTooLarge"),
      });

      if (validationError) {
        toastRef.current.error(t("propertyDocumentUploadError"), {
          description: validationError,
        });
        return null;
      }

      try {
        return await uploadPropertyDocument(file, activeSubmissionId);
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        toastRef.current.error(t("propertyDocumentUploadError"), { description: message });
        return null;
      }
    },
    [ensureSubmissionId, t],
  );

  // 10. Return values
  return {
    onUploadPropertyMedia,
    onUploadPropertyDocument,
  };
}
