"use client";

import { CloudUpload } from "lucide-react";
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { cn } from "@/src/lib/cn";
import { ACCEPTED_LICENSE_DOCUMENT_EXTENSIONS } from "@/src/lib/validateLicenseDocumentFile";
import { bodyTextClasses, captionTextClasses } from "@/src/lib/typography";

export type LicenseDocumentUploadProps = {
  label: string;
  uploadPrompt: string;
  uploadHint: string;
  onFileSelect: (file: File) => void;
  selectedFileName?: string | null;
  error?: string;
  isRequired?: boolean;
  isUploading?: boolean;
  uploadingLabel?: string;
  disabled?: boolean;
  className?: string;
  /** `compact` — horizontal drop zone for modals and dense forms. */
  variant?: "default" | "compact";
};

export function LicenseDocumentUpload({
  label,
  uploadPrompt,
  uploadHint,
  onFileSelect,
  selectedFileName,
  error,
  isRequired = false,
  isUploading = false,
  uploadingLabel,
  disabled = false,
  className,
  variant = "default",
}: LicenseDocumentUploadProps) {
  const isCompact = variant === "compact";
  const uploadInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const isDisabled = disabled || isUploading;

  const applyFile = (file: File | null) => {
    if (!file || isDisabled) return;
    onFileSelect(file);
  };

  const openFilePicker = () => {
    if (isDisabled) return;
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    applyFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (isDisabled) return;
    applyFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDisabled) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const displayFileName = isUploading
    ? uploadingLabel
    : selectedFileName?.trim() || null;

  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className={cn(bodyTextClasses, "font-medium text-text")}>
        {label}
        {isRequired ? (
          <span className="ms-0.5 text-danger" aria-hidden>
            *
          </span>
        ) : null}
      </span>

      <div
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled}
        onKeyDown={(event) => {
          if (isDisabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFilePicker();
          }
        }}
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex cursor-pointer rounded-xl border-2 border-dashed transition-colors",
          "border-primary bg-primary-light hover:border-primary-dark data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
          isDragOver && !isDisabled && "border-primary-dark bg-primary-light/80",
          error && "border-danger",
          isDisabled && "pointer-events-none opacity-50",
          isCompact
            ? "flex-row items-center gap-3 px-3 py-2.5 text-start sm:gap-4 sm:px-4"
            : "flex-col items-center justify-center gap-2 px-4 py-6 text-center sm:py-8",
        )}
        data-disabled={isDisabled}
      >
        <CloudUpload
          className={cn(
            "shrink-0 text-primary",
            isCompact ? "size-7" : "size-8 sm:size-10",
          )}
          aria-hidden
        />
        <div className={cn("min-w-0 flex-1", isCompact ? "text-start" : "text-center")}>
          <p className={cn(bodyTextClasses, "font-medium text-text")}>{uploadPrompt}</p>
          <p className={cn(captionTextClasses, "text-muted")}>{uploadHint}</p>
          {displayFileName != null ? (
            <p
              className={cn(
                "max-w-full truncate font-medium text-primary-dark",
                isCompact ? "mt-0.5" : "mt-1",
                captionTextClasses,
              )}
            >
              {displayFileName}
            </p>
          ) : null}
        </div>
      </div>

      <input
        ref={fileInputRef}
        id={uploadInputId}
        type="file"
        accept={ACCEPTED_LICENSE_DOCUMENT_EXTENSIONS.join(",")}
        className="sr-only"
        disabled={isDisabled}
        onChange={handleFileInputChange}
      />

      {error != null ? (
        <p role="alert" className={cn(bodyTextClasses, "text-danger")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
