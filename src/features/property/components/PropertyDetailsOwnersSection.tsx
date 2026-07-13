"use client";

import { Card } from "@/src/components/ui/card";
import { cn } from "@/src/lib/cn";
import { bodySmallTextClasses, overlineLabelClasses } from "@/src/lib/typography";
import type { PropertyDetails } from "../types/property.types";

type LibraryPropertyOwner = NonNullable<PropertyDetails["owner"]>;

type PropertyDetailsOwnersSectionProps = {
  owners: LibraryPropertyOwner[];
  title: string;
  noContactLabel: string;
  className?: string;
};

function OwnerDetailsRow({
  owner,
  noContactLabel,
}: {
  owner: LibraryPropertyOwner;
  noContactLabel: string;
}) {
  const contactLine = owner.phone?.trim() || owner.email?.trim() || noContactLabel;

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg bg-page p-2 text-text/85",
        bodySmallTextClasses,
      )}
    >
      <span className="font-medium text-secondary/90">{owner.name}</span>
      <span className="text-text/65">{contactLine}</span>
    </div>
  );
}

export function PropertyDetailsOwnersSection({
  owners,
  title,
  noContactLabel,
  className,
}: PropertyDetailsOwnersSectionProps) {
  if (owners.length === 0) {
    return null;
  }

  return (
    <Card
      className={cn(
        "flex w-full min-w-0 flex-col gap-4 p-4 sm:p-5 md:p-6",
        className,
      )}
      aria-label={title}
    >
      <h3 className={cn("text-muted", overlineLabelClasses)}>{title}</h3>

      <div className="flex flex-col gap-3">
        {owners.map((owner) => (
          <OwnerDetailsRow
            key={owner.id}
            owner={owner}
            noContactLabel={noContactLabel}
          />
        ))}
      </div>
    </Card>
  );
}
