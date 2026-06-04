"use client";

import type { ReactNode } from "react";
import { Avatar } from "@/src/components/ui/avatar";
import { cn } from "@/src/lib/cn";

export type ProfileAvatarDisplayProps = {
  src: string | null;
  name: string;
  children?: ReactNode;
};

export function ProfileAvatarDisplay({ src, name, children }: ProfileAvatarDisplayProps) {
  return (
    <div className="relative size-full overflow-hidden rounded-full border-2 border-secondary/15">
      <Avatar
        src={src}
        name={name}
        size="xl"
        className={cn(
          "!size-full !rounded-full !bg-inherit-color-15 !text-text text-xl sm:text-2xl",
        )}
      />
      {children}
    </div>
  );
}
