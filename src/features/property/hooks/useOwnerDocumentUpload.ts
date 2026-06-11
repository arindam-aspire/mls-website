"use client";

import { uploadOwnerDocument } from "@/src/features/property/services/upload.service";
import { useToast } from "@/src/hooks/useToast";
import { createDraftClientId } from "@/src/lib/createDraftClientId";
import { validateOwnerDocumentFile } from "@/src/lib/validateOwnerDocumentFile";
import { useTranslations } from "next-intl";
import { useCallback, useRef } from "react";

export function useOwnerDocumentUpload() {
  // 2. UI utilities
  const t = useTranslations("propertyList.propertyCreate");
  const toast = useToast();

  // 8. Refs
  const draftClientIdRef = useRef<string>(createDraftClientId());
  const toastRef = useRef(toast);
  toastRef.current = toast;

  // 7. Callbacks
  const onUploadOwnerDocument = useCallback(
    async (file: File, _context: { ownerIndex: number }) => {
      const validationError = validateOwnerDocumentFile(file, {
        invalidType: t("ownerDocumentUploadInvalidType"),
        tooLarge: t("ownerDocumentUploadTooLarge"),
      });

      if (validationError) {
        toastRef.current.error(t("ownerDocumentUploadError"), {
          description: validationError,
        });
        return null;
      }

      try {
        return await uploadOwnerDocument(file, draftClientIdRef.current);
      } catch (error) {
        const message = error instanceof Error ? error.message : undefined;
        toastRef.current.error(t("ownerDocumentUploadError"), { description: message });
        return null;
      }
    },
    [t],
  );

  // 10. Return values
  return {
    onUploadOwnerDocument,
  };
}
