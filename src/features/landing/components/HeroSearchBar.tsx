"use client";

import {
  AutocompleteInput,
  Button,
  Card,
  SELECT_DROPDOWN_EMPTY_VALUE,
  SelectDropdown,
  Skeleton,
  type AutocompleteInputOption,
} from "@/src/components/ui";
import { ButtonGroup } from "@/src/components/ui/button-group";
import type { LocationTaxonomyResponse } from "@/src/features/landing/types/locationTaxonomy.types";
import {
  getPropertyCategories,
  type PropertyTaxonomyResponse,
} from "@/src/features/landing/types/propertyTaxonomy.types";
import {
  buildLocationSuggestions,
  filterLocationSuggestions,
  parseLocationOptionValue,
} from "@/src/features/landing/utils/locationTaxonomy.utils";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { bodyTextClasses } from "@/src/lib/typography";
import { MapPin, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const LISTING_TYPES = ["buy", "rent"] as const;

const searchBarWrapperClass =
  "flex w-full min-w-0 max-w-4xl flex-col items-stretch text-start md:items-start";

const searchCardClass = cn(
  "w-full min-w-0 overflow-visible !border-0 max-md:shadow-none",
  "rounded-xl !rounded-t-none px-4 py-3",
  "md:!rounded-full md:!rounded-tl-none md:px-6 md:py-4",
);

const searchGridClass = cn(
  "grid w-full min-w-0 grid-cols-1 items-center gap-3",
  "md:grid-cols-4 md:gap-4",
);

const tabRowClass =
  "mt-4 flex w-full gap-0 sm:mt-6 md:inline-flex md:w-auto";

const tabSkeletonClass =
  "h-9 w-full rounded-t-lg bg-white/50 dark:bg-surface/50 md:h-10 md:w-[22.5rem]";

const fieldSkeletonClass = "h-11 w-full rounded-lg";

const searchButtonSkeletonClass = "h-11 w-full rounded-lg md:rounded-full";

type HeroSearchBarProps = {
  t: (key: string) => string;
  theme: string;
  isLoading: boolean;
  propertyTaxonomy?: PropertyTaxonomyResponse;
  locationTaxonomy?: LocationTaxonomyResponse;
};

function HeroSearchBarSkeleton({
  propertyTypeLabel,
}: {
  propertyTypeLabel: string;
}) {
  return (
    <div
      className={searchBarWrapperClass}
      aria-busy="true"
      aria-label={propertyTypeLabel}
    >
      <div className={tabRowClass}>
        <Skeleton className={tabSkeletonClass} />
      </div>

      <Card className={searchCardClass}>
        <div className={searchGridClass}>
          <Skeleton className={fieldSkeletonClass} />
          <Skeleton className={fieldSkeletonClass} />
          <Skeleton className={fieldSkeletonClass} />
          <Skeleton className={searchButtonSkeletonClass} />
        </div>
      </Card>
    </div>
  );
}

export function HeroSearchBar({
  t,
  theme,
  isLoading,
  propertyTaxonomy,
  locationTaxonomy,
}: HeroSearchBarProps) {
  const router = useRouter();
  const categories = useMemo(
    () => getPropertyCategories(propertyTaxonomy),
    [propertyTaxonomy],
  );

  const locationSuggestions = useMemo(
    () => buildLocationSuggestions(locationTaxonomy),
    [locationTaxonomy],
  );

  const [propertyType, setPropertyType] = useState("");
  const [subtype, setSubtype] = useState(SELECT_DROPDOWN_EMPTY_VALUE);
  const [listingType, setListingType] = useState<(typeof LISTING_TYPES)[number]>(
    LISTING_TYPES[0],
  );
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedLocationValue, setSelectedLocationValue] = useState("");
  const [cityName, setCityName] = useState<string | undefined>();
  const [locationName, setLocationName] = useState<string | undefined>();

  const locationOptions = useMemo((): AutocompleteInputOption[] => {
    return filterLocationSuggestions(locationSuggestions, locationQuery).map(
      (item) => ({
        value: item.value,
        label: item.label,
      }),
    );
  }, [locationQuery, locationSuggestions]);

  useEffect(() => {
    if (categories.length === 0) {
      return;
    }

    setPropertyType((current) =>
      categories.some((category) => category.slug === current)
        ? current
        : categories[0].slug,
    );
  }, [categories]);

  const activePropertyType = useMemo(() => {
    if (categories.some((category) => category.slug === propertyType)) {
      return propertyType;
    }
    return categories[0]?.slug ?? "";
  }, [categories, propertyType]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.slug === activePropertyType),
    [categories, activePropertyType],
  );

  const subtypeOptions = useMemo(
    () =>
      selectedCategory?.property_types.map((type) => ({
        value: String(type.id),
        label: type.name,
      })) ?? [],
    [selectedCategory],
  );

  const handlePropertyTypeChange = (nextType: string) => {
    setPropertyType(nextType);
    setSubtype(SELECT_DROPDOWN_EMPTY_VALUE);
  };

  const handleListingTypeChange = (nextType: string) => {
    if (LISTING_TYPES.includes(nextType as (typeof LISTING_TYPES)[number])) {
      setListingType(nextType as (typeof LISTING_TYPES)[number]);
    }
  };

  const handleLocationOptionSelect = (option: AutocompleteInputOption) => {
    const { city, locations } = parseLocationOptionValue(option.value);
    setLocationQuery(option.label);
    setSelectedLocationValue(option.value);
    setCityName(city);
    setLocationName(locations);
  };

  const handleLocationInputChange = (value: string) => {
    setLocationQuery(value);
    setSelectedLocationValue("");
    setCityName(undefined);
    setLocationName(undefined);
  };

  const handleSearch = () => {
    const query: Record<string, string> = {
      status: listingType,
      category: activePropertyType,
    };

    if (subtype !== SELECT_DROPDOWN_EMPTY_VALUE) {
      query.type = subtype;
    }

    if (cityName) {
      query.city = cityName;
    }

    if (locationName) {
      query.locations = locationName;
    }

    router.push({
      pathname: "/property-list",
      query,
    });
  };

  if (isLoading) {
    return (
      <HeroSearchBarSkeleton
        propertyTypeLabel={t("heroPropertyTypeLabel")}
      />
    );
  }

  const tabButtonClass = cn(
    "flex-1 px-3 py-2 font-medium uppercase md:flex-none md:px-5 md:py-2.5",
    bodyTextClasses,
  );

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
    <div className={searchBarWrapperClass}>
      <ButtonGroup
        aria-label={t("heroPropertyTypeLabel")}
        value={activePropertyType}
        onChange={handlePropertyTypeChange}
        size="sm"
        fullWidth
        items={categories.map((category) => ({
          value: category.slug,
          label: category.name,
        }))}
        rounded="top-only"
        className={cn(tabRowClass, "!border-0 bg-transparent")}
        selectedClassName={selectedTabClass}
        unselectedClassName={unselectedTabClass}
      />
      <Card className={searchCardClass}>
        <div className={searchGridClass}>
          <SelectDropdown
            className="min-w-0"
            aria-label={t("heroListingPlaceholder")}
            placeholder={t("heroListingPlaceholder")}
            value={listingType}
            onChange={handleListingTypeChange}
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
            options={subtypeOptions}
            variant="ghost"
          />
          <AutocompleteInput
            wrapperClassName="min-w-0 w-full"
            className="min-w-0 w-full"
            aria-label={t("heroLocationPlaceholder")}
            placeholder={t("heroLocationPlaceholder")}
            inputValue={locationQuery}
            value={selectedLocationValue}
            options={locationOptions}
            onInputChange={handleLocationInputChange}
            onOptionSelect={handleLocationOptionSelect}
            iconEnd={<MapPin />}
            variant="ghost"
            minCharsToShow={1}
            emptyMessage="No locations found"
          />
          <Button
            type="button"
            color="primary"
            fullWidth
            isRounded
            iconStart={<Search />}
            className="h-11 min-w-0 shrink-0"
            onClick={handleSearch}
          >
            {t("heroSearch")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
