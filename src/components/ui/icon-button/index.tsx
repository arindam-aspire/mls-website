"use client";

import { cn } from "@/src/lib/cn";
import { iconButtonSizeClasses } from "../responsiveSizes";
import { Button } from "../button";
import type { IconButtonProps } from "./types";

const iconButtonSizeClassesMap = iconButtonSizeClasses;

export function IconButton({
  icon,
  size = "md",
  className,
  isRounded = false,
  fullWidth = false,
  ...rest
}: IconButtonProps) {
  return (
    <Button
      size={size}
      isRounded={isRounded}
      fullWidth={fullWidth}
      iconStart={icon}
      className={cn(iconButtonSizeClassesMap[size], className)}
      {...rest}
    />
  );
}

export type { IconButtonProps } from "./types";

