"use client";

import { PropertyCardList } from "@abdoun/abdoun-library";
import { useMemo } from "react";
import type { ComponentProps } from "react";
import type { PropertyListing } from "../types/property.types";
import { mapListingForPropertyCard } from "../utils/mapListingForPropertyCard";

type LibraryCardListProps = ComponentProps<typeof PropertyCardList>;

export type PropertyListingCardListProps = Omit<
  LibraryCardListProps,
  "canViewOwners" | "canViewAgents" | "data"
> & {
  data: PropertyListing[];
};

/**
 * Library `PropertyCardList` with MLS card rules: hide owners, show agency/agent
 * names when present, keep Grid and List layouts on the same data mapping.
 */
export function PropertyListingCardList({
  data,
  layoutVariant,
  className,
  ...props
}: PropertyListingCardListProps) {
  const cardData = useMemo(
    () => data.map(mapListingForPropertyCard),
    [data],
  );
  const listClassName = [
    className,
    layoutVariant === "list" ? "mls-property-list-view" : undefined,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <PropertyCardList
        {...props}
        data={cardData}
        layoutVariant={layoutVariant}
        className={listClassName}
        canViewOwners={false}
        canViewAgents
      />

      <style jsx global>{`
        .mls-property-list-view
          [role="article"]
          > div:nth-child(2)
          > div:last-child
          > div:last-child
          > div:last-child {
          display: flex;
          width: 100%;
          flex-direction: row;
          justify-content: flex-end;
          margin-inline-start: auto;
        }

        @media (min-width: 640px) {
          .mls-property-list-view
            [role="article"]
            > div:nth-child(2)
            > div:last-child
            > div:last-child
            > div:last-child {
            width: auto;
          }
        }
      `}</style>
    </>
  );
}
