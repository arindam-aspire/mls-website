"use client";

import { useEffect } from "react";
import type { PropertyLocationMapRenderProps } from "@abdoun/abdoun-library";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { Minus, Plus } from "lucide-react";
import { IconButton, Skeleton, ToggleButton } from "@/src/components/ui";
import {
  PROPERTY_LOCATION_MAP_DEFAULT_ZOOM,
  PROPERTY_LOCATION_MAP_MAX_ZOOM,
  PROPERTY_LOCATION_MAP_MIN_ZOOM,
  PROPERTY_LOCATION_MAP_REGION,
  PROPERTY_LOCATION_MAP_TYPE,
} from "@/src/features/property/constants/propertyLocationMap.constants";
import { usePropertyLocationMap } from "@/src/features/property/hooks/usePropertyLocationMap";

function PropertyLocationMapInstanceBridge({
  onMap,
}: {
  onMap: (map: ReturnType<typeof useMap>) => void;
}) {
  const map = useMap();

  useEffect(() => {
    onMap(map);
    return () => onMap(null);
  }, [map, onMap]);

  return null;
}

export function PropertyLocationMap(props: PropertyLocationMapRenderProps) {
  const {
    apiKey,
    hasApiKey,
    locale,
    labels,
    controlLabels,
    resolvedLatitude,
    resolvedLongitude,
    markerPosition,
    zoom,
    mapTypeId,
    renderingType,
    colorScheme,
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
  } = usePropertyLocationMap(props);

  const unavailableMessage = hasApiKey
    ? controlLabels.loadError
    : controlLabels.missingApiKey;
  const showUnavailable = !hasApiKey || hasLoadError;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">{labels.selectPinHint}</p>
      {showUnavailable ? (
        <div
          className="flex h-56 w-full items-center justify-center rounded-xl border border-secondary/15 bg-page px-4 text-center sm:h-64 md:h-80"
          role="status"
          aria-label={labels.mapTitle}
        >
          <p className="text-sm text-muted">{unavailableMessage}</p>
        </div>
      ) : (
        <div
          className="relative h-56 w-full overflow-hidden rounded-xl border border-secondary/15 bg-page sm:h-64 md:h-80"
          role="application"
          aria-label={labels.mapTitle}
        >
          <APIProvider
            apiKey={apiKey}
            language={locale}
            region={PROPERTY_LOCATION_MAP_REGION}
            version="weekly"
            onError={onApiError}
          >
            <Map
              className="size-full"
              style={{ width: "100%", height: "100%" }}
              defaultCenter={markerPosition}
              defaultZoom={PROPERTY_LOCATION_MAP_DEFAULT_ZOOM}
              zoom={zoom}
              mapTypeId={mapTypeId}
              renderingType={renderingType}
              colorScheme={colorScheme}
              isFractionalZoomEnabled
              minZoom={PROPERTY_LOCATION_MAP_MIN_ZOOM}
              maxZoom={PROPERTY_LOCATION_MAP_MAX_ZOOM}
              gestureHandling="greedy"
              disableDefaultUI
              clickableIcons={false}
              onClick={onMapClick}
              onZoomChanged={onZoomChanged}
              onIdle={onIdle}
            >
              <Marker
                position={markerPosition}
                draggable
                onDragEnd={onMarkerDragEnd}
                title={labels.coordinates}
              />
              <PropertyLocationMapInstanceBridge onMap={setMapInstance} />
            </Map>
          </APIProvider>
          {!isMapReady ? (
            <div
              className="absolute inset-0 z-10"
              aria-busy
              aria-label={controlLabels.loading}
            >
              <Skeleton variant="block" className="size-full rounded-none" />
            </div>
          ) : null}
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="pointer-events-auto absolute end-3 top-3 max-w-[calc(100%-1.5rem)]">
              <ToggleButton
                size="md"
                color="primary"
                variant="solid"
                value={mapTypeId}
                onChange={onMapTypeChange}
                aria-label={controlLabels.mapTypeGroup}
                className="min-h-11 shadow-md"
                items={[
                  {
                    value: PROPERTY_LOCATION_MAP_TYPE.roadmap,
                    label: controlLabels.mapView,
                  },
                  {
                    value: PROPERTY_LOCATION_MAP_TYPE.satellite,
                    label: controlLabels.satelliteView,
                  },
                ]}
              />
            </div>
            <div className="pointer-events-auto absolute end-3 bottom-12 flex flex-col gap-1 rounded-xl border border-secondary/15 bg-surface/95 p-1 shadow-md">
              <IconButton
                size="md"
                color="inherit"
                variant="ghost"
                icon={<Plus />}
                aria-label={controlLabels.zoomIn}
                disabled={!canZoomIn}
                onClick={onZoomIn}
                className="min-h-11 min-w-11"
              />
              <IconButton
                size="md"
                color="inherit"
                variant="ghost"
                icon={<Minus />}
                aria-label={controlLabels.zoomOut}
                disabled={!canZoomOut}
                onClick={onZoomOut}
                className="min-h-11 min-w-11"
              />
            </div>
          </div>
        </div>
      )}
      <p className="text-xs text-muted">
        {labels.coordinates}: {resolvedLatitude.toFixed(5)},{" "}
        {resolvedLongitude.toFixed(5)}
      </p>
    </div>
  );
}
