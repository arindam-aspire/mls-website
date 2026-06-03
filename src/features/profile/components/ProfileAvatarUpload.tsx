"use client";

import { Camera, Loader2, Trash2 } from "lucide-react";
import type { ChangeEvent, RefObject } from "react";
import { Avatar } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/cn";
import { bodyTextClasses } from "@/src/lib/typography";

export type ProfileAvatarUploadProps = {
  src: string | null;
  name: string;
  uploadLabel: string;
  uploadingLabel: string;
  removeLabel: string;
  photoHint: string;
  onUploadClick: () => void;
  onRemoveClick: () => void;
  canRemove: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
  isRemoving: boolean;
  removingLabel: string;
};

function isAvatarBusy(isUploading: boolean, isRemoving: boolean) {
  return isUploading || isRemoving;
}

const cameraButtonClass = cn(
  "absolute -bottom-1 -end-1 z-30 flex size-8 items-center justify-center rounded-full",
  "border-2 border-white bg-inherit-color text-white shadow-md",
  "transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
  "disabled:pointer-events-none disabled:opacity-50",
);

export function ProfileAvatarUpload({
  src,
  name,
  uploadLabel,
  uploadingLabel,
  removeLabel,
  photoHint,
  onUploadClick,
  onRemoveClick,
  canRemove,
  fileInputRef,
  onFileChange,
  isUploading,
  isRemoving,
  removingLabel,
}: ProfileAvatarUploadProps) {
  const busy = isAvatarBusy(isUploading, isRemoving);

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="group relative size-28 shrink-0 overflow-visible sm:size-32">
        <div className="relative size-full overflow-hidden rounded-full border-2 border-secondary/15">
          <Avatar
            src={src}
            name={name}
            size="xl"
            className={cn(
              "!size-full !rounded-full !bg-inherit-color-15 !text-text text-xl sm:text-2xl",
            )}
          />

          {canRemove ? (
            <button
              type="button"
              disabled={busy}
              className={cn(
                "absolute inset-0 z-10 flex items-center justify-center rounded-full",
                "bg-text/40 text-white opacity-0 transition-opacity",
                "pointer-events-none group-hover:pointer-events-auto",
                "group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100",
                isRemoving && "pointer-events-auto opacity-100",
                "disabled:pointer-events-none",
              )}
              onClick={onRemoveClick}
              aria-label={isRemoving ? removingLabel : removeLabel}
              aria-busy={isRemoving}
            >
              {isRemoving ? (
                <Loader2 className="size-5 animate-spin" aria-hidden />
              ) : (
                <Trash2 className="size-5" aria-hidden />
              )}
            </button>
          ) : null}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={onFileChange}
        />
        <button
          type="button"
          disabled={busy}
          className={cameraButtonClass}
          onClick={onUploadClick}
          aria-label={isUploading ? uploadingLabel : uploadLabel}
          aria-busy={isUploading}
        >
          {isUploading ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden />
          ) : (
            <Camera className="size-3.5" aria-hidden />
          )}
        </button>
      </div>

      <p className={cn(bodyTextClasses, "max-w-xs text-center text-sm text-muted")}>
        {photoHint}
      </p>
    </div>
  );
}
