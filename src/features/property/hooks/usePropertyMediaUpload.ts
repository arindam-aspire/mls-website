"use client";

import {
  uploadPropertyDocument,
  uploadPropertyMediaImage,
} from "@/src/features/property/services/upload.service";
import { useToast } from "@/src/hooks/useToast";
import { createDraftClientId } from "@/src/lib/createDraftClientId";
import { validateOwnerDocumentFile } from "@/src/lib/validateOwnerDocumentFile";
import { validatePropertyMediaImageFile } from "@/src/lib/validatePropertyMediaImageFile";
import { useTranslations } from "next-intl";
import { useCallback, useRef, type MutableRefObject } from "react";

type UsePropertyMediaUploadOptions = {
  /**
   * Prefer `submission_id`. When missing, save draft first and return the new id.
   * Returns `null` if draft save fails — caller then falls back to `draft_client_id`.
   */
  ensureSubmissionIdRef?: MutableRefObject<() => Promise<string | null>>;
};

export function usePropertyMediaUpload(
  submissionId: string | null,
  options?: UsePropertyMediaUploadOptions,
) {
  // 2. UI utilities
  const t = useTranslations("propertyList.propertyCreate");
  const toast = useToast();

  // 8. Refs — prefer submission_id; else draft_client_id after ensure attempt
  const draftClientIdRef = useRef<string>(createDraftClientId());
  const toastRef = useRef(toast);
  toastRef.current = toast;

  // 7. Callbacks
  const resolveUploadTarget = useCallback(async (): Promise<{
    submission_id?: string;
    draft_client_id?: string;
  }> => {
    if (submissionId) {
      return { submission_id: submissionId };
    }

    const ensuredId = options?.ensureSubmissionIdRef
      ? await options.ensureSubmissionIdRef.current()
      : null;

    if (ensuredId) {
      return { submission_id: ensuredId };
    }

    return { draft_client_id: draftClientIdRef.current };
  }, [options?.ensureSubmissionIdRef, submissionId]);

  const onUploadPropertyMedia = useCallback(
    async (file: File) => {
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
        const uploadTarget = await resolveUploadTarget();
        return await uploadPropertyMediaImage(file, uploadTarget);
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : undefined;
        toastRef.current.error(t("propertyMediaUploadError"), {
          description: message,
        });
        return null;
      }
    },
    [resolveUploadTarget, t],
  );

  const onUploadPropertyDocument = useCallback(
    async (file: File) => {
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
        const uploadTarget = await resolveUploadTarget();
        return await uploadPropertyDocument(file, uploadTarget);
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim().length > 0
            ? error.message
            : undefined;
        toastRef.current.error(t("propertyDocumentUploadError"), {
          description: message,
        });
        return null;
      }
    },
    [resolveUploadTarget, t],
  );

  // 10. Return values
  return {
    onUploadPropertyMedia,
    onUploadPropertyDocument,
  };
}
