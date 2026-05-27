import { create } from "zustand";
import type { PropertyListParams, PropertyListResponse } from "../types/property.types";

type PropertyState = {
  propertyListParams: PropertyListParams;
  propertyListResponse: PropertyListResponse | null;
  setPropertyListParams: (params: Partial<PropertyListParams>) => void;
  setPropertyListResponse: (response: PropertyListResponse) => void;
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
  propertyListResponse: null,

  setPropertyListParams: (params) => {
    set((state) => ({
      propertyListParams: {
        ...state.propertyListParams,
        ...params,
      },
    }));
  },

  setPropertyListResponse: (response) => {
    set({ propertyListResponse: response });
  },

  resetPropertyList: () => {
    set({
      propertyListParams: INITIAL_PARAMS,
      propertyListResponse: null,
    });
  },
}));
