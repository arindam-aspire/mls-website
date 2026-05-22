"use client";

import { MapPin, Search } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";
import { ButtonGroup } from "@/src/components/ui/button-group";
import { useTheme } from "@/src/providers/ThemeProvider";
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
  const { theme } = useTheme();
  const [propertyType, setPropertyType] = useState<string>(PROPERTY_TYPES[0]);
  const [subtype, setSubtype] = useState(SELECT_DROPDOWN_EMPTY_VALUE);
  const [listingType, setListingType] = useState(SELECT_DROPDOWN_EMPTY_VALUE);
  const [location, setLocation] = useState("");

  const tabButtonClass =
    "flex-1 px-3 py-2 text-xs font-medium uppercase lg:flex-none lg:px-5 lg:py-2.5 lg:text-sm";

  const selectedTabClass = cn(
    "!bg-white !text-black data-hover:!bg-white data-active:!bg-white",
    tabButtonClass,
  );

  const unselectedTabClass = cn(
    tabButtonClass,
    theme === "dark"
      ? "!bg-surface !text-text data-hover:!opacity-90 data-active:!opacity-80"
      : "!bg-inherit-color !text-white data-hover:!opacity-90 data-active:!opacity-80",
  );

  return (
    <div className="flex w-full min-w-0 max-w-4xl flex-col items-stretch text-start lg:items-start">
      <ButtonGroup
        aria-label={t("heroPropertyTypeLabel")}
        value={propertyType}
        onChange={setPropertyType}
        size="sm"
        fullWidth
        items={PROPERTY_TYPES.map((type) => ({
          value: type,
          label: t(`heroPropertyType_${type}`),
        }))}
        rounded="top-only"
        className="mt-4 w-full !border-0 bg-transparent sm:mt-6 lg:inline-flex lg:w-auto"
        selectedClassName={selectedTabClass}
        unselectedClassName={unselectedTabClass}
      />
      <Card
        className={cn(
          "w-full min-w-0 !border-0 max-md:shadow-none",
          "rounded-xl !rounded-t-none px-4 py-3",
          "md:rounded-2xl md:!rounded-t-none md:px-5 md:py-3.5",
          "lg:!rounded-full lg:!rounded-tl-none lg:px-6 lg:py-4",
        )}
      >
        <div
          className={cn(
            "grid w-full min-w-0 grid-cols-1 items-center gap-3",
            "md:grid-cols-2 md:gap-3",
            "lg:grid-cols-4 lg:gap-4",
          )}
        >
          <SelectDropdown
            className="min-w-0"
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
            className="min-w-0"
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
            wrapperClassName="min-w-0 md:col-span-2 lg:col-span-1"
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
            className="h-11 min-w-0 shrink-0 md:col-span-2 lg:col-span-1"
          >
            {t("heroSearch")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
