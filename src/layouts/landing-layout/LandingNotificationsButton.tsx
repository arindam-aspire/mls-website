"use client";

import { PublicNotificationsButton } from "@/src/layouts/public-layout/PublicNotificationsButton";

export interface LandingNotificationsButtonProps {
  overHero: boolean;
  onClick: () => void;
}

export function LandingNotificationsButton({
  overHero,
  onClick,
}: LandingNotificationsButtonProps) {
  return <PublicNotificationsButton overHero={overHero} onClick={onClick} />;
}
