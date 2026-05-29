import { create } from "zustand";
import type { PropertyTaxonomyResponse } from "@/src/features/landing/types/propertyTaxonomy.types";
import type { PropertyListings, PropertyListParams } from "../types/property.types";

type PropertyState = {
  propertyListParams: PropertyListParams;
  propertyListings: PropertyListings | null;
  propertyTaxonomy: PropertyTaxonomyResponse | null;
  setPropertyListParams: (params: Partial<PropertyListParams>) => void;
  setPropertyListings: (listings: PropertyListings) => void;
  setPropertyTaxonomy: (taxonomy: PropertyTaxonomyResponse) => void;
  resetPropertyList: () => void;
};

const INITIAL_PARAMS: PropertyListParams = {
  page: 1,
  pageSize: 10,
  category: "",
  status: "",
};

export const usePropertyStore = create<PropertyState>((set) => ({
  propertyListParams: INITIAL_PARAMS,
  propertyListings: null,
  propertyTaxonomy: null,

  setPropertyListParams: (params) => {
    set((state) => ({
      propertyListParams: {
        ...state.propertyListParams,
        ...params,
      },
    }));
  },

  setPropertyListings: (data) => {
    set({ propertyListings: data });
  },

  setPropertyTaxonomy: (taxonomy) => {
    set({ propertyTaxonomy: taxonomy });
  },

  resetPropertyList: () => {
    set({
      propertyListParams: INITIAL_PARAMS,
      propertyListings: null,
      propertyTaxonomy: null,
    });
  },
}));
