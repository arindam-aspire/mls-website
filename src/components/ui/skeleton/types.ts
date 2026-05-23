import type { HTMLAttributes } from "react";

export const SKELETON_VARIANTS = ["block", "text", "circular"] as const;

export type SkeletonVariant = (typeof SKELETON_VARIANTS)[number];

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

export interface SkeletonTextProps extends HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lineClassName?: string;
}
