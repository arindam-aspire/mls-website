import type { PropertyFormOption } from "@abdoun/abdoun-library";

export type PropertyFormOptionItem = {
  value?: string | number;
  slug?: string | number;
  code?: string | number;
  name?: string;
  title?: string;
  text?: string;
  label?: string;
  id?: string | number;
  furniture_status_id?: string | number;
  furnishing_status_id?: string | number;
  floor_id?: string | number;
  floor_level_id?: string | number;
  nationality_id?: string | number;
  land_type_id?: string | number;
  landTypeId?: string | number;
};

export type PropertyFormOptionList =
  | PropertyFormOptionItem[]
  | {
      items?: PropertyFormOptionItem[];
      data?: PropertyFormOptionItem[];
      results?: PropertyFormOptionItem[];
    };

export type PropertyFormOptionsData = {
  listing_purposes?: PropertyFormOptionList;
  listingPurposes?: PropertyFormOptionList;
  listing_purpose?: PropertyFormOptionList;
  listingPurpose?: PropertyFormOptionList;
  furnishing_statuses?: PropertyFormOptionList;
  furnishingStatuses?: PropertyFormOptionList;
  furniture_statuses?: PropertyFormOptionList;
  furnitureStatuses?: PropertyFormOptionList;
  furniture_status?: PropertyFormOptionList;
  furnitureStatus?: PropertyFormOptionList;
  furnishing_status?: PropertyFormOptionList;
  floor_levels?: PropertyFormOptionList;
  floorLevels?: PropertyFormOptionList;
  floors?: PropertyFormOptionList;
  floor?: PropertyFormOptionList;
  floor_level?: PropertyFormOptionList;
  floorLevel?: PropertyFormOptionList;
  floor_options?: PropertyFormOptionList;
  floorOptions?: PropertyFormOptionList;
  completion_statuses?: PropertyFormOptionList;
  completionStatuses?: PropertyFormOptionList;
  completion_status?: PropertyFormOptionList;
  orientations?: PropertyFormOptionList;
  direction?: PropertyFormOptionList;
  nationalities?: PropertyFormOptionList;
  nationality?: PropertyFormOptionList;
  land_types?: PropertyFormOptionList;
  landTypes?: PropertyFormOptionList;
  land_type?: PropertyFormOptionList;
  landType?: PropertyFormOptionList;
  /** Grouped master rows from `GET /property-form-options` (`data.groups`). */
  groups?: Record<string, PropertyFormOptionList>;
  items?: PropertyFormOptionItem[];
  total?: number;
};

export type PropertyFormOptionsResponse = {
  success: boolean;
  message: string | null;
  data?: PropertyFormOptionsData | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export type PropertyFormOptionsCatalog = {
  listingPurposeOptions: PropertyFormOption[];
  furnishingStatusOptions: PropertyFormOption[];
  floorLevelOptions: PropertyFormOption[];
  completionStatusOptions: PropertyFormOption[];
  orientationOptions: PropertyFormOption[];
  nationalityOptions: PropertyFormOption[];
  /** DLS Land Type master options (Arabic `name` labels; id values). */
  landTypeOptions: PropertyFormOption[];
};
