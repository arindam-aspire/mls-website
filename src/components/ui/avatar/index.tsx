"use client";

import Image from "next/image";
import { cn } from "@/src/lib/cn";
import { shouldUnoptimizeImageSrc } from "@/src/lib/shouldUnoptimizeImageSrc";
import { avatarSizeTextClasses } from "@/src/lib/typography";
import type { AvatarProps, AvatarSize } from "./types";

const sizeClasses: Record<AvatarSize, string> = {
  xs: cn("size-7", avatarSizeTextClasses.xs),
  sm: cn("size-9", avatarSizeTextClasses.sm),
  md: cn("size-11", avatarSizeTextClasses.md),
  lg: cn("size-14", avatarSizeTextClasses.lg),
  xl: cn("size-20", avatarSizeTextClasses.xl),
};

const imageSizeMap: Record<AvatarSize, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 56,
  xl: 80,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  className,
  onClick,
}: AvatarProps) {
  const base = cn(
    "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-semibold select-none",
    sizeClasses[size],
    onClick && "cursor-pointer transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
    className,
  );

  const imgSize = imageSizeMap[size];

  if (src) {
    return (
      <span className={base} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}>
        <Image
          src={src}
          alt={alt || name || "Avatar"}
          width={imgSize}
          height={imgSize}
          unoptimized={shouldUnoptimizeImageSrc(src)}
          className="size-full object-cover"
        />
      </span>
    );
  }

  const initials = name ? getInitials(name) : "?";

  return (
    <span className={base} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} aria-label={name || "User avatar"}>
      {initials}
    </span>
  );
}

export type { AvatarProps, AvatarSize } from "./types";
