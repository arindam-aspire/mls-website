"use client";

import { Link } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem, BreadcrumbProps } from "./types";

const itemBaseClasses =
  "inline-flex min-w-0 max-w-full items-center gap-1.5 text-sm transition-colors";

const linkClasses = cn(
  itemBaseClasses,
  "rounded-lg text-muted hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
);

const currentClasses = cn(itemBaseClasses, "font-medium text-text");

function BreadcrumbSegment({ item }: { item: BreadcrumbItem }) {
  const Icon = item.icon;
  const content = (
    <>
      {Icon != null ? <Icon className="size-4 shrink-0" aria-hidden /> : null}
      {item.label != null && item.label.length > 0 ? (
        <span className="truncate">{item.label}</span>
      ) : null}
    </>
  );

  if (item.isCurrent || item.href == null) {
    return (
      <span className={currentClasses} aria-current={item.isCurrent ? "page" : undefined}>
        {content}
      </span>
    );
  }

  const accessibleName = item.label ?? item.ariaLabel;

  return (
    <Link
      href={item.href}
      className={linkClasses}
      aria-label={item.label == null ? item.ariaLabel : undefined}
      title={accessibleName}
    >
      {content}
    </Link>
  );
}

export function Breadcrumb({ items, ariaLabel, className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className="flex min-w-0 flex-wrap items-center gap-1">
        {items.map((item, index) => (
          <li key={item.id} className="inline-flex min-w-0 items-center gap-1">
            {index > 0 ? (
              <ChevronRight className="size-3.5 shrink-0 text-muted" aria-hidden />
            ) : null}
            <BreadcrumbSegment item={item} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

export type { BreadcrumbItem, BreadcrumbProps } from "./types";
