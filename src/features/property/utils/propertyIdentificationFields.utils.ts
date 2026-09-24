import type { PropertyArrangementId } from "@/src/features/property/constants/propertyArrangement.constants";
import {
  PROPERTY_IDENTIFICATION_BUILT_IN_KEYS,
  PROPERTY_IDENTIFICATION_CUSTOM_KEYS,
  PROPERTY_IDENTIFICATION_FIELDS_BY_ARRANGEMENT,
  PROPERTY_IDENTIFICATION_NUMERIC_KEYS,
  PROPERTY_LAND_IDENTIFICATION_PLACEHOLDER_KEY,
  type PropertyIdentificationBuiltInKey,
  type PropertyIdentificationFieldKey,
} from "@/src/features/property/constants/propertyIdentification.constants";
import type { PropertyFormValues } from "@abdoun/abdoun-library";

type LocationInsert = NonNullable<PropertyFormValues["location_insert"]>;

const BUILT_IN_IDENTIFICATION_KEY_SET = new Set<string>(
  PROPERTY_IDENTIFICATION_BUILT_IN_KEYS,
);

export function isValidNumericIdentificationValue(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }

  return /^-?\d+(\.\d+)?$/.test(trimmed);
}

function allowedIdentificationKeys(
  arrangement: PropertyArrangementId,
): Set<string> {
  return new Set(PROPERTY_IDENTIFICATION_FIELDS_BY_ARRANGEMENT[arrangement]);
}

export type PropertyLocationIdentificationSnapshot = {
  apartment_number: string;
  plot_number: string;
  parcel_number: string;
  building_number: string;
  identification_fields: Record<string, string>;
};

export function extractPropertyFormIdentification(
  propertyDetails: PropertyFormValues,
): PropertyLocationIdentificationSnapshot {
  const location = propertyDetails.location_insert;

  return {
    apartment_number: location?.apartment_number ?? "",
    plot_number: location?.plot_number ?? "",
    parcel_number: location?.parcel_number ?? "",
    building_number: location?.building_number ?? "",
    identification_fields: { ...(location?.identification_fields ?? {}) },
  };
}

export function getLocationIdentificationValue(
  location: LocationInsert | undefined,
  key: PropertyIdentificationFieldKey,
): string {
  if (location == null) {
    return "";
  }

  if (BUILT_IN_IDENTIFICATION_KEY_SET.has(key)) {
    const value = location[key as PropertyIdentificationBuiltInKey];
    return value == null ? "" : String(value);
  }

  const custom = location.identification_fields?.[key];
  return custom == null ? "" : String(custom);
}

export function withLocationIdentificationValue(
  propertyDetails: PropertyFormValues,
  key: PropertyIdentificationFieldKey,
  value: string,
): PropertyFormValues {
  const location = (propertyDetails.location_insert ?? {}) as LocationInsert;

  if (BUILT_IN_IDENTIFICATION_KEY_SET.has(key)) {
    return {
      ...propertyDetails,
      location_insert: {
        ...location,
        [key]: value,
      },
    };
  }

  return {
    ...propertyDetails,
    location_insert: {
      ...location,
      identification_fields: {
        ...(location.identification_fields ?? {}),
        [key]: value,
      },
    },
  };
}

/**
 * Keeps arrangement-allowed free-text identification values and clears the rest
 * (including Basin Number and legacy free-text land_type).
 */
export function pruneLocationIdentificationForArrangement(
  location: LocationInsert | undefined,
  arrangement: PropertyArrangementId,
): LocationInsert | undefined {
  if (location == null) {
    return location;
  }

  const allowed = allowedIdentificationKeys(arrangement);
  const nextBuiltIns = { ...location };

  for (const key of PROPERTY_IDENTIFICATION_BUILT_IN_KEYS) {
    if (!allowed.has(key)) {
      nextBuiltIns[key] = "";
    }
  }

  const identificationFields: Record<string, string> = {
    ...(location.identification_fields ?? {}),
  };

  for (const key of Object.keys(identificationFields)) {
    if (!allowed.has(key) || key === PROPERTY_LAND_IDENTIFICATION_PLACEHOLDER_KEY) {
      delete identificationFields[key];
    }
  }

  for (const key of PROPERTY_IDENTIFICATION_CUSTOM_KEYS) {
    if (!allowed.has(key)) {
      delete identificationFields[key];
    }
  }

  delete identificationFields[PROPERTY_LAND_IDENTIFICATION_PLACEHOLDER_KEY];
  delete identificationFields.land_type;

  return {
    ...nextBuiltIns,
    identification_fields: identificationFields,
  };
}

export function prunePropertyFormIdentificationForArrangement(
  propertyDetails: PropertyFormValues,
  arrangement: PropertyArrangementId,
): PropertyFormValues {
  const prunedLocation = {
    ...propertyDetails,
    location_insert: pruneLocationIdentificationForArrangement(
      propertyDetails.location_insert,
      arrangement,
    ),
  };

  if (arrangement === "properties") {
    return prunedLocation;
  }

  type PropertyDetailsWithLandType = NonNullable<
    PropertyFormValues["property_details"]
  > & {
    land_type_id?: string | number | null;
    land_type?: string | number | null;
    landType?: string | number | null;
  };

  const details = prunedLocation.property_details as
    | PropertyDetailsWithLandType
    | undefined;

  if (!details) {
    return prunedLocation;
  }

  // Host-owned master ids — not yet on library `PropertyDetailsFormValues`.
  const nextDetails: PropertyDetailsWithLandType = {
    ...details,
    land_type_id: null,
    land_type: null,
    landType: null,
  };

  return {
    ...prunedLocation,
    property_details: nextDetails,
  };
}

export type FloorNumberValidationLabels = {
  floorNumberInvalid: string;
};

export function validateLocationIdentificationForArrangement(
  location: LocationInsert | undefined,
  arrangement: PropertyArrangementId,
  labels: FloorNumberValidationLabels,
): Record<string, string> {
  const errors: Record<string, string> = {};
  const allowed = allowedIdentificationKeys(arrangement);

  for (const key of PROPERTY_IDENTIFICATION_NUMERIC_KEYS) {
    if (!allowed.has(key)) {
      continue;
    }

    const value = getLocationIdentificationValue(location, key);
    if (!isValidNumericIdentificationValue(value)) {
      errors[key] = labels.floorNumberInvalid;
    }
  }

  return errors;
}
