type PropertyLocationMapControlTranslation = (
  key:
    | "map.zoomIn"
    | "map.zoomOut"
    | "map.mapView"
    | "map.satelliteView"
    | "map.mapTypeGroup"
    | "map.missingApiKey"
    | "map.loadError"
    | "map.loading",
) => string;

export type PropertyLocationMapControlLabels = {
  zoomIn: string;
  zoomOut: string;
  mapView: string;
  satelliteView: string;
  mapTypeGroup: string;
  missingApiKey: string;
  loadError: string;
  loading: string;
};

export function buildPropertyLocationMapControlLabels(
  t: PropertyLocationMapControlTranslation,
): PropertyLocationMapControlLabels {
  return {
    zoomIn: t("map.zoomIn"),
    zoomOut: t("map.zoomOut"),
    mapView: t("map.mapView"),
    satelliteView: t("map.satelliteView"),
    mapTypeGroup: t("map.mapTypeGroup"),
    missingApiKey: t("map.missingApiKey"),
    loadError: t("map.loadError"),
    loading: t("map.loading"),
  };
}
