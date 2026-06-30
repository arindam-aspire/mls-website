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
  const draftClientIdRef = useRef<string | null>(null);

  // 7. Callbacks
  const resolveUploadTarget = useCallback((): { submission_id?: string; draft_client_id?: string } => {
    if (submissionId) {
      return { submission_id: submissionId };
    }

    if (!draftClientIdRef.current) {
      draftClientIdRef.current =
        globalThis.crypto?.randomUUID?.() ??
        `property-draft-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }

    return { draft_client_id: draftClientIdRef.current };
  }, [submissionId]);

  const onUploadPropertyMedia = useCallback(
    async (file: File) => {
      const uploadTarget = resolveUploadTarget();

      const validationError = validatePropertyMediaImageFile(file, {
        invalidType: t("propertyMediaUploadInvalidType"),
        tooLarge: t("propertyMediaUploadTooLarge"),
      });

      if (validationError) {
        toast.error(t("propertyMediaUploadError"), {
          description: validationError,
        });
        return null;
      }

      try {
        return await uploadPropertyMediaImage(file, uploadTarget);
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        toast.error(t("propertyMediaUploadError"), { description: message });
        return null;
      }
    },
    [resolveUploadTarget, t, toast],
  );

  const onUploadPropertyDocument = useCallback(
    async (file: File) => {
      const uploadTarget = resolveUploadTarget();

      const validationError = validateOwnerDocumentFile(file, {
        invalidType: t("propertyDocumentUploadInvalidType"),
        tooLarge: t("propertyDocumentUploadTooLarge"),
      });

      if (validationError) {
        toast.error(t("propertyDocumentUploadError"), {
          description: validationError,
        });
        return null;
      }

      try {
        return await uploadPropertyDocument(file, uploadTarget);
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        toast.error(t("propertyDocumentUploadError"), { description: message });
        return null;
      }
    },
    [resolveUploadTarget, t, toast],
  );

  // 10. Return values
  return {
    onUploadPropertyMedia,
    onUploadPropertyDocument,
  };
}
