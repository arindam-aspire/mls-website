import {
  propertyFormSteps,
  type PropertyFormValues,
} from "@abdoun/abdoun-library";

export const INITIAL_PROPERTY_FORM_VALUES: PropertyFormValues = {
  location_insert: {
    city_id: null,
    area_id: null,
    area_ids: [],
    address: "",
    latitude: null,
    longitude: null,
    apartment_number: "",
    plot_number: "",
    basin_number: "",
    parcel_number: "",
    building_number: "",
    identification_fields: {},
    show_location: false,
  },
  property_details: {
    bedrooms: null,
    bathrooms: null,
    built_up_area: "",
    built_up_area_unit: "SQM",
    parking_spaces: null,
    year_built: null,
    property_age: null,
    furnishing_status: null,
    floor_level: null,
    completion_status: null,
    total_floor: "",
    occupancy: null,
    ownership_type: null,
    reference_number: "",
    orientation: null,
    guard_name: "",
    guard_country_code: "+962",
    guard_phone_number: "",
  },
  basic_info: {
    title: "",
    description: "",
    listing_purposes: ["sale"],
    listing_purpose: "sale",
    category_id: null,
    type_id: null,
  },
  owner_info: {
    owner_mode: "create",
    owner_id: null,
    owners: [],
  },
  pricing_details: {
    price: "",
    price_currency: "JOD",
    service_charge: "",
    service_charge_currency: "JOD",
    maintenance_fee: "",
    maintenance_fee_currency: "JOD",
    furnished_sale_price: "",
    unfurnished_sale_price: "",
    furnished_rent_price: "",
    unfurnished_rent_price: "",
    semi_furnished_rent_price: "",
    additional_prices: {},
  },
} as PropertyFormValues;

/** Default `PropertyForm` / API step index (1-based; matches `@abdoun/abdoun-library`). */
export const INITIAL_PROPERTY_FORM_ACTIVE_STEP = 1;

/** 1-based Location step index from the library-owned form step catalog. */
export const PROPERTY_FORM_LOCATION_STEP =
  propertyFormSteps.findIndex((step) => step.value === "location") + 1;

/** 1-based Review & Submit step index from the library-owned form step catalog. */
export const PROPERTY_FORM_FINALIZE_STEP =
  propertyFormSteps.findIndex((step) => step.value === "finalize") + 1;
