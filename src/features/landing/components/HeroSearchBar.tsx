"use client";

import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ButtonGroup } from "@/src/components/ui/button-group";
import {
  Button,
  Card,
  Input,
  SelectDropdown,
  SELECT_DROPDOWN_EMPTY_VALUE,
} from "@/src/components/ui";

const PROPERTY_TYPES = ["residential", "commercial", "lands"] as const;

const PROPERTY_SUBTYPES = ["apartments", "villas", "buildings", "farms"] as const;

const LISTING_TYPES = ["buy", "rent"] as const;

export function HeroSearchBar() {
  const t = useTranslations("home");
  const [propertyType, setPropertyType] = useState<string>(PROPERTY_TYPES[0]);
  const [subtype, setSubtype] = useState(SELECT_DROPDOWN_EMPTY_VALUE);
  const [listingType, setListingType] = useState(SELECT_DROPDOWN_EMPTY_VALUE);
  const [location, setLocation] = useState("");

  return (
    <div className="flex min-w-4xl flex-col items-start text-start">
      <ButtonGroup
        aria-label={t("heroPropertyTypeLabel")}
        value={propertyType}
        onChange={setPropertyType}
        size="sm"
        items={PROPERTY_TYPES.map((type) => ({
          value: type,
          label: t(`heroPropertyType_${type}`),
        }))}
        rounded="top-only"
        className="mt-4 border-0 bg-transparent sm:mt-6"
        selectedClassName="!bg-white !text-text px-5 py-2.5 text-xs font-medium uppercase data-hover:!bg-white data-active:!bg-white sm:text-sm"
        unselectedClassName="!bg-inherit-color !text-white px-5 py-2.5 text-xs font-medium uppercase data-hover:!opacity-90 data-active:!opacity-80 sm:text-sm"
      />
      <Card className="w-full !rounded-tl-none !rounded-full !border-0 px-6 py-4">
        <div className="grid w-full grid-cols-1 items-center gap-4 sm:grid-cols-4">
          <SelectDropdown
            aria-label={t("heroListingPlaceholder")}
            placeholder={t("heroListingPlaceholder")}
            value={listingType}
            onChange={setListingType}
            options={LISTING_TYPES.map((type) => ({
              value: type,
              label: t(`heroListing_${type}`),
            }))}
            variant="ghost"
          />
          <SelectDropdown
            aria-label={t("heroSelectTypePlaceholder")}
            placeholder={t("heroSelectTypePlaceholder")}
            value={subtype}
            onChange={setSubtype}
            options={PROPERTY_SUBTYPES.map((type) => ({
              value: type,
              label: t(`heroPropertySubtype_${type}`),
            }))}
            variant="ghost"
          />
          <Input
            aria-label={t("heroLocationPlaceholder")}
            placeholder={t("heroLocationPlaceholder")}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            iconEnd={<MapPin />}
            variant="ghost"
          />
          <Button
            type="button"
            color="primary"
            fullWidth
            isRounded
            iconStart={<Search />}
            className="h-11 shrink-0"
          >
            {t("heroSearch")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
