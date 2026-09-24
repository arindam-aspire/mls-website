"use client";

import type { SelectOption } from "@/src/components/ui/select/types";
import { EMPTY_PROPERTY_LOCATION_DLS } from "@/src/features/property/constants/propertyLocationDls.constants";
import type { PropertyLocationDlsLabels } from "@/src/features/property/i18n/propertyLocationDls.i18n";
import {
  findDlsLocationName,
  getDlsLocationItems,
  mapDlsLocationItemsToSelectOptions,
} from "@/src/features/property/mappers/dlsLocations.mapper";
import { getDlsLocations } from "@/src/features/property/services/dls.service";
import type {
  DlsLevel,
  DlsLocationItem,
  PropertyLocationDlsSelection,
} from "@/src/features/property/types/dls.types";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export type PropertyLocationDlsSelectFieldModel = {
  kind?: "select";
  id: DlsLevel | "land_type";
  name: string;
  label: string;
  placeholder: string;
  options: SelectOption[];
  value: string;
  disabled: boolean;
  hint?: string;
  error?: string;
  retryLabel?: string;
  onRetry?: () => void;
  onChange: (value: string) => void;
};

export type PropertyLocationDlsTextFieldModel = {
  kind: "text";
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  disabled: boolean;
  error?: string;
  inputType?: "text" | "number";
  inputMode?: "text" | "numeric" | "decimal";
  onChange: (value: string) => void;
};

export type PropertyLocationDlsFieldModel =
  | PropertyLocationDlsSelectFieldModel
  | PropertyLocationDlsTextFieldModel;

export type UsePropertyLocationDlsParams = {
  selection: PropertyLocationDlsSelection;
  onChange: (selection: PropertyLocationDlsSelection) => void;
  disabled?: boolean;
  labels: PropertyLocationDlsLabels;
};

function buildFieldState(params: {
  options: SelectOption[];
  isPending: boolean;
  isError: boolean;
  isEnabled: boolean;
  waitingHint?: string;
  labels: PropertyLocationDlsLabels;
  refetch: () => void;
}): Partial<
  Pick<
    PropertyLocationDlsFieldModel,
    "disabled" | "hint" | "error" | "retryLabel" | "onRetry"
  >
> {
  const { options, isPending, isError, isEnabled, waitingHint, labels, refetch } =
    params;

  if (!isEnabled) {
    return {
      disabled: true,
      hint: waitingHint,
    };
  }

  if (isPending) {
    return {
      disabled: true,
      hint: labels.loading,
    };
  }

  if (isError) {
    return {
      disabled: true,
      error: labels.loadError,
      retryLabel: labels.retry,
      onRetry: () => {
        void refetch();
      },
    };
  }

  if (options.length === 0) {
    return {
      disabled: true,
      hint: labels.empty,
    };
  }

  return {};
}

export function usePropertyLocationDls({
  selection,
  onChange,
  disabled = false,
  labels,
}: UsePropertyLocationDlsParams) {
  const govQuery = useQuery({
    queryKey: ["dls-locations", "gov"],
    queryFn: () => getDlsLocations({ level: "gov" }),
  });

  const deptQuery = useQuery({
    queryKey: ["dls-locations", "dept", selection.gov_code],
    queryFn: () =>
      getDlsLocations({
        level: "dept",
        gov_code: selection.gov_code,
      }),
    enabled: Boolean(selection.gov_code),
  });

  const villQuery = useQuery({
    queryKey: ["dls-locations", "vill", selection.gov_code, selection.dept_code],
    queryFn: () =>
      getDlsLocations({
        level: "vill",
        gov_code: selection.gov_code,
        dept_code: selection.dept_code,
      }),
    enabled: Boolean(selection.gov_code && selection.dept_code),
  });

  const hodQuery = useQuery({
    queryKey: [
      "dls-locations",
      "hod",
      selection.gov_code,
      selection.dept_code,
      selection.vill_code,
    ],
    queryFn: () =>
      getDlsLocations({
        level: "hod",
        gov_code: selection.gov_code,
        dept_code: selection.dept_code,
        vill_code: selection.vill_code,
      }),
    enabled: Boolean(
      selection.gov_code && selection.dept_code && selection.vill_code,
    ),
  });

  const sectQuery = useQuery({
    queryKey: [
      "dls-locations",
      "sect",
      selection.gov_code,
      selection.dept_code,
      selection.vill_code,
      selection.hod_code,
    ],
    queryFn: () =>
      getDlsLocations({
        level: "sect",
        gov_code: selection.gov_code,
        dept_code: selection.dept_code,
        vill_code: selection.vill_code,
        hod_code: selection.hod_code,
      }),
    enabled: Boolean(
      selection.gov_code &&
        selection.dept_code &&
        selection.vill_code &&
        selection.hod_code,
    ),
  });

  const govItems = useMemo(
    () => getDlsLocationItems(govQuery.data),
    [govQuery.data],
  );
  const deptItems = useMemo(
    () => getDlsLocationItems(deptQuery.data),
    [deptQuery.data],
  );
  const villItems = useMemo(
    () => getDlsLocationItems(villQuery.data),
    [villQuery.data],
  );
  const hodItems = useMemo(
    () => getDlsLocationItems(hodQuery.data),
    [hodQuery.data],
  );
  const sectItems = useMemo(
    () => getDlsLocationItems(sectQuery.data),
    [sectQuery.data],
  );

  const onLevelChange = useCallback(
    (level: DlsLevel, code: string, items: DlsLocationItem[]) => {
      const name = findDlsLocationName(items, code);

      if (level === "gov") {
        onChange({
          ...EMPTY_PROPERTY_LOCATION_DLS,
          gov_code: code,
          gov_name: name,
        });
        return;
      }

      if (level === "dept") {
        onChange({
          ...EMPTY_PROPERTY_LOCATION_DLS,
          gov_code: selection.gov_code,
          gov_name: selection.gov_name,
          dept_code: code,
          dept_name: name,
        });
        return;
      }

      if (level === "vill") {
        onChange({
          ...EMPTY_PROPERTY_LOCATION_DLS,
          gov_code: selection.gov_code,
          gov_name: selection.gov_name,
          dept_code: selection.dept_code,
          dept_name: selection.dept_name,
          vill_code: code,
          vill_name: name,
        });
        return;
      }

      if (level === "hod") {
        onChange({
          ...selection,
          hod_code: code,
          hod_name: name,
          sect_code: "",
          sect_name: "",
        });
        return;
      }

      onChange({
        ...selection,
        sect_code: code,
        sect_name: name,
      });
    },
    [onChange, selection],
  );

  const fields = useMemo((): PropertyLocationDlsFieldModel[] => {
    const govOptions = mapDlsLocationItemsToSelectOptions(
      govItems,
      selection.gov_code,
      selection.gov_name,
    );
    const deptOptions = mapDlsLocationItemsToSelectOptions(
      deptItems,
      selection.dept_code,
      selection.dept_name,
    );
    const villOptions = mapDlsLocationItemsToSelectOptions(
      villItems,
      selection.vill_code,
      selection.vill_name,
    );
    const hodOptions = mapDlsLocationItemsToSelectOptions(
      hodItems,
      selection.hod_code,
      selection.hod_name,
    );
    const sectOptions = mapDlsLocationItemsToSelectOptions(
      sectItems,
      selection.sect_code,
      selection.sect_name,
    );

    const govState = buildFieldState({
      options: govOptions,
      isPending: govQuery.isPending,
      isError: govQuery.isError,
      isEnabled: true,
      labels,
      refetch: govQuery.refetch,
    });
    const deptState = buildFieldState({
      options: deptOptions,
      isPending: deptQuery.isPending,
      isError: deptQuery.isError,
      isEnabled: Boolean(selection.gov_code),
      waitingHint: labels.selectGovernentFirst,
      labels,
      refetch: deptQuery.refetch,
    });
    const villState = buildFieldState({
      options: villOptions,
      isPending: villQuery.isPending,
      isError: villQuery.isError,
      isEnabled: Boolean(selection.gov_code && selection.dept_code),
      waitingHint: labels.selectDirectorateFirst,
      labels,
      refetch: villQuery.refetch,
    });
    const hodState = buildFieldState({
      options: hodOptions,
      isPending: hodQuery.isPending,
      isError: hodQuery.isError,
      isEnabled: Boolean(
        selection.gov_code && selection.dept_code && selection.vill_code,
      ),
      waitingHint: labels.selectVillageFirst,
      labels,
      refetch: hodQuery.refetch,
    });
    const sectState = buildFieldState({
      options: sectOptions,
      isPending: sectQuery.isPending,
      isError: sectQuery.isError,
      isEnabled: Boolean(
        selection.gov_code &&
          selection.dept_code &&
          selection.vill_code &&
          selection.hod_code,
      ),
      waitingHint: labels.selectParcelFirst,
      labels,
      refetch: sectQuery.refetch,
    });

    return [
      {
        id: "gov",
        name: "gov_code",
        label: labels.governent,
        placeholder: labels.governentPlaceholder,
        options: govOptions,
        value: selection.gov_code,
        onChange: (value) => onLevelChange("gov", value, govItems),
        ...govState,
        disabled: disabled || Boolean(govState.disabled),
      },
      {
        id: "dept",
        name: "dept_code",
        label: labels.directorate,
        placeholder: labels.directoratePlaceholder,
        options: deptOptions,
        value: selection.dept_code,
        onChange: (value) => onLevelChange("dept", value, deptItems),
        ...deptState,
        disabled: disabled || Boolean(deptState.disabled),
      },
      {
        id: "vill",
        name: "vill_code",
        label: labels.village,
        placeholder: labels.villagePlaceholder,
        options: villOptions,
        value: selection.vill_code,
        onChange: (value) => onLevelChange("vill", value, villItems),
        ...villState,
        disabled: disabled || Boolean(villState.disabled),
      },
      {
        id: "hod",
        name: "hod_code",
        label: labels.parcel,
        placeholder: labels.parcelPlaceholder,
        options: hodOptions,
        value: selection.hod_code,
        onChange: (value) => onLevelChange("hod", value, hodItems),
        ...hodState,
        disabled: disabled || Boolean(hodState.disabled),
      },
      {
        id: "sect",
        name: "sect_code",
        label: labels.section,
        placeholder: labels.sectionPlaceholder,
        options: sectOptions,
        value: selection.sect_code,
        onChange: (value) => onLevelChange("sect", value, sectItems),
        ...sectState,
        disabled: disabled || Boolean(sectState.disabled),
      },
    ];
  }, [
    deptItems,
    deptQuery.isError,
    deptQuery.isPending,
    deptQuery.refetch,
    disabled,
    govItems,
    govQuery.isError,
    govQuery.isPending,
    govQuery.refetch,
    hodItems,
    hodQuery.isError,
    hodQuery.isPending,
    hodQuery.refetch,
    labels,
    onLevelChange,
    sectItems,
    sectQuery.isError,
    sectQuery.isPending,
    sectQuery.refetch,
    selection.dept_code,
    selection.dept_name,
    selection.gov_code,
    selection.gov_name,
    selection.hod_code,
    selection.hod_name,
    selection.sect_code,
    selection.sect_name,
    selection.vill_code,
    selection.vill_name,
    villItems,
    villQuery.isError,
    villQuery.isPending,
    villQuery.refetch,
  ]);

  return {
    sectionTitle: labels.sectionTitle,
    fields,
  };
}
