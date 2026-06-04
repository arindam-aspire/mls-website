"use client";

import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { ProfilePopover } from "@/src/layouts/public-layout/ProfilePopover";

export interface LandingProfilePopoverProps {
  user: LoggedInUser;
  overHero: boolean;
}

export function LandingProfilePopover({ user, overHero }: LandingProfilePopoverProps) {
  return <ProfilePopover user={user} overHero={overHero} />;
}
