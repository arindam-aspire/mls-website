"use client";

import { Camera } from "lucide-react";
import { Avatar } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/cn";

export type ProfileAvatarUploadProps = {
  src: string | null;
  name: string;
  uploadLabel: string;
  onUploadClick: () => void;
};

export function ProfileAvatarUpload({
  src,
  name,
  uploadLabel,
  onUploadClick,
}: ProfileAvatarUploadProps) {
  return (
    <div className="relative shrink-0">
      <Avatar
        src={src}
        name={name}
        size="xl"
        className="!size-24 rounded-full text-lg sm:!size-28 sm:text-xl"
      />
      <button
        type="button"
        className={cn(
          "absolute bottom-0 end-0 flex size-10 items-center justify-center rounded-full sm:size-11",
          "border border-secondary/15 bg-surface text-text shadow-sm",
          "transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        )}
        onClick={onUploadClick}
        aria-label={uploadLabel}
      >
        <Camera className="size-4 sm:size-5" aria-hidden />
      </button>
    </div>
  );
}
