export const AVATAR_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export type AvatarSize = (typeof AVATAR_SIZES)[number];

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
  onClick?: () => void;
}
