"use client";

import { PublicHeaderThemeButton } from "@/src/layouts/public-layout/PublicHeaderThemeButton";

export interface LandingHeaderThemeButtonProps {
  overHero: boolean;
  className?: string;
}

export function LandingHeaderThemeButton({
  overHero,
  className,
}: LandingHeaderThemeButtonProps) {
  return <PublicHeaderThemeButton overHero={overHero} className={className} />;
}
