"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { PropertyLocationMapRenderProps } from "@abdoun/abdoun-library";
import {
  ColorScheme,
  RenderingType,
  type MapCameraChangedEvent,
  type MapMouseEvent,
  type MarkerProps,
} from "@vis.gl/react-google-maps";
import { GOOGLE_MAPS_API_KEY } from "@/src/configs/environment.config";
import { useTheme } from "@/src/providers/ThemeProvider";
import {
  PROPERTY_LOCATION_MAP_DEFAULT_LATITUDE,
  PROPERTY_LOCATION_MAP_DEFAULT_LONGITUDE,
  PROPERTY_LOCATION_MAP_DEFAULT_ZOOM,
  PROPERTY_LOCATION_MAP_MAX_ZOOM,
  PROPERTY_LOCATION_MAP_MIN_ZOOM,
  PROPERTY_LOCATION_MAP_TYPE,
  type PropertyLocationMapTypeId,
} from "@/src/features/property/constants/propertyLocationMap.constants";
import { buildPropertyLocationMapControlLabels } from "@/src/features/property/i18n/propertyLocationMap.i18n";

type MarkerDragEndHandler = NonNullable<MarkerProps["onDragEnd"]>;
type MapInstance = {
  panTo: (latLng: { lat: number; lng: number }) => void;
};

export function usePropertyLocationMap({
  latitude,
  longitude,
  onCoordinatesChange,
  labels,
}: PropertyLocationMapRenderProps) {
  const locale = useLocale();
  const t = useTranslations("propertyList.propertyCreate.form");
  const { theme } = useTheme();

  const [zoom, setZoom] = useState(PROPERTY_LOCATION_MAP_DEFAULT_ZOOM);
  const [mapTypeId, setMapTypeId] = useState<PropertyLocationMapTypeId>(
    PROPERTY_LOCATION_MAP_TYPE.roadmap,
  );
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [mapInstance, setMapInstance] = useState<MapInstance | null>(null);

  const skipNextPanRef = useRef(false);

  const controlLabels = useMemo(
    () => buildPropertyLocationMapControlLabels(t),
    [t],
  );

  const resolvedLatitude = latitude ?? PROPERTY_LOCATION_MAP_DEFAULT_LATITUDE;
  const resolvedLongitude = longitude ?? PROPERTY_LOCATION_MAP_DEFAULT_LONGITUDE;
  const hasApiKey = GOOGLE_MAPS_API_KEY.length > 0;
  const canZoomIn = zoom < PROPERTY_LOCATION_MAP_MAX_ZOOM;
  const canZoomOut = zoom > PROPERTY_LOCATION_MAP_MIN_ZOOM;
  const markerPosition = useMemo(
    () => ({ lat: resolvedLatitude, lng: resolvedLongitude }),
    [resolvedLatitude, resolvedLongitude],
  );

  const applyCoordinates = useCallback(
    (nextLatitude: number, nextLongitude: number) => {
      skipNextPanRef.current = true;
      onCoordinatesChange({
        latitude: Number(nextLatitude.toFixed(6)),
        longitude: Number(nextLongitude.toFixed(6)),
      });
    },
    [onCoordinatesChange],
  );

  const onMapClick = useCallback(
    (event: MapMouseEvent) => {
      const latLng = event.detail.latLng;
      if (!latLng) {
        return;
      }

      applyCoordinates(latLng.lat, latLng.lng);
    },
    [applyCoordinates],
  );

  const onMarkerDragEnd = useCallback<MarkerDragEndHandler>(
    (event) => {
      const latLng = event.latLng;
      if (!latLng) {
        return;
      }

      applyCoordinates(latLng.lat(), latLng.lng());
    },
    [applyCoordinates],
  );

  const onZoomIn = useCallback(() => {
    setZoom((current) =>
      Math.min(PROPERTY_LOCATION_MAP_MAX_ZOOM, current + 1),
    );
  }, []);

  const onZoomOut = useCallback(() => {
    setZoom((current) =>
      Math.max(PROPERTY_LOCATION_MAP_MIN_ZOOM, current - 1),
    );
  }, []);

  const onMapTypeChange = useCallback((value: PropertyLocationMapTypeId) => {
    setMapTypeId(value);
  }, []);

  const onZoomChanged = useCallback((event: MapCameraChangedEvent) => {
    setZoom(event.detail.zoom);
  }, []);

  const onIdle = useCallback(() => {
    setIsMapReady(true);
  }, []);

  const onApiError = useCallback(() => {
    setHasLoadError(true);
  }, []);

  useEffect(() => {
    if (!mapInstance) {
      return;
    }

    if (typeof google !== "undefined") {
      google.maps.event.trigger(mapInstance, "resize");
    }

    if (skipNextPanRef.current) {
      skipNextPanRef.current = false;
      return;
    }

    mapInstance.panTo({
      lat: resolvedLatitude,
      lng: resolvedLongitude,
    });
  }, [mapInstance, resolvedLatitude, resolvedLongitude]);

  return {
    apiKey: GOOGLE_MAPS_API_KEY,
    hasApiKey,
    locale,
    labels,
    controlLabels,
    resolvedLatitude,
    resolvedLongitude,
    markerPosition,
    zoom,
    mapTypeId,
    renderingType: RenderingType.VECTOR,
    colorScheme: theme === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT,
    isMapReady,
    hasLoadError,
    canZoomIn,
    canZoomOut,
    setMapInstance,
    onMapClick,
    onMarkerDragEnd,
    onZoomIn,
    onZoomOut,
    onMapTypeChange,
    onZoomChanged,
    onIdle,
    onApiError,
  };
}
