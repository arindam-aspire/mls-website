"use client";

import { useCallback, useMemo, useState } from "react";
import type { PropertyLocationMapRenderProps } from "@abdoun/abdoun-library";
import { cn } from "@/src/lib/cn";

const DEFAULT_LATITUDE = 31.9539;
const DEFAULT_LONGITUDE = 35.9106;
const DEFAULT_ZOOM = 13;

function clampLatitude(latitude: number): number {
  return Math.max(-85, Math.min(85, latitude));
}

function lonToTileX(longitude: number, zoom: number): number {
  return ((longitude + 180) / 360) * 2 ** zoom;
}

function latToTileY(latitude: number, zoom: number): number {
  const clamped = clampLatitude(latitude);
  const radians = (clamped * Math.PI) / 180;
  return (
    ((1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2) *
    2 ** zoom
  );
}

function tileXToLon(x: number, zoom: number): number {
  return (x / 2 ** zoom) * 360 - 180;
}

function tileYToLat(y: number, zoom: number): number {
  const n = Math.PI - (2 * Math.PI * y) / 2 ** zoom;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}

type PointerPoint = {
  clientX: number;
  clientY: number;
};

export function PropertyLocationMap({
  latitude,
  longitude,
  onCoordinatesChange,
  labels,
}: PropertyLocationMapRenderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const resolvedLatitude = latitude ?? DEFAULT_LATITUDE;
  const resolvedLongitude = longitude ?? DEFAULT_LONGITUDE;

  const centerTile = useMemo(
    () => ({
      x: lonToTileX(resolvedLongitude, DEFAULT_ZOOM),
      y: latToTileY(resolvedLatitude, DEFAULT_ZOOM),
    }),
    [resolvedLatitude, resolvedLongitude],
  );

  const tileOrigin = useMemo(
    () => ({
      x: Math.floor(centerTile.x) - 1,
      y: Math.floor(centerTile.y) - 1,
    }),
    [centerTile.x, centerTile.y],
  );

  const pinLeft =
    ((centerTile.x - tileOrigin.x) / 3) * 100;
  const pinTop =
    ((centerTile.y - tileOrigin.y) / 3) * 100;

  const updateFromPoint = useCallback(
    (event: PointerPoint, target: HTMLElement) => {
      const bounds = target.getBoundingClientRect();
      if (bounds.width === 0 || bounds.height === 0) {
        return;
      }

      const xRatio = (event.clientX - bounds.left) / bounds.width;
      const yRatio = (event.clientY - bounds.top) / bounds.height;
      const tileX = tileOrigin.x + xRatio * 3;
      const tileY = tileOrigin.y + yRatio * 3;

      onCoordinatesChange({
        latitude: Number(tileYToLat(tileY, DEFAULT_ZOOM).toFixed(6)),
        longitude: Number(tileXToLon(tileX, DEFAULT_ZOOM).toFixed(6)),
      });
    },
    [onCoordinatesChange, tileOrigin.x, tileOrigin.y],
  );

  const tiles = useMemo(() => {
    const next: { x: number; y: number; key: string }[] = [];
    const maxTile = 2 ** DEFAULT_ZOOM;

    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        const tileX = ((tileOrigin.x + x) % maxTile + maxTile) % maxTile;
        const tileY = Math.max(0, Math.min(maxTile - 1, tileOrigin.y + y));
        next.push({
          x: tileX,
          y: tileY,
          key: `${tileX}-${tileY}`,
        });
      }
    }

    return next;
  }, [tileOrigin.x, tileOrigin.y]);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted">{labels.selectPinHint}</p>
      <div
        className={cn(
          "relative h-56 w-full overflow-hidden rounded-xl border border-secondary/15 bg-page sm:h-64 md:h-80",
          isDragging ? "cursor-grabbing" : "cursor-crosshair",
        )}
        onClick={(event) => {
          updateFromPoint(event, event.currentTarget);
        }}
        onPointerMove={(event) => {
          if (!isDragging) {
            return;
          }

          updateFromPoint(event, event.currentTarget);
        }}
        onPointerUp={() => setIsDragging(false)}
        onPointerLeave={() => setIsDragging(false)}
        role="application"
        aria-label={labels.mapTitle}
      >
        <div
          className="absolute inset-0 grid grid-cols-3 grid-rows-3"
          aria-hidden
        >
          {tiles.map((tile) => (
            <div
              key={tile.key}
              aria-hidden
              className="size-full bg-cover bg-center"
              style={{
                backgroundImage: `url(https://tile.openstreetmap.org/${DEFAULT_ZOOM}/${tile.x}/${tile.y}.png)`,
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="absolute z-10 -translate-x-1/2 -translate-y-full rounded-full"
          style={{ left: `${pinLeft}%`, top: `${pinTop}%` }}
          aria-label={labels.coordinates}
          onPointerDown={(event) => {
            event.stopPropagation();
            setIsDragging(true);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!isDragging) {
              return;
            }

            const map = event.currentTarget.parentElement;
            if (!map) {
              return;
            }

            updateFromPoint(event, map);
          }}
          onPointerUp={() => setIsDragging(false)}
        >
          <span className="block size-5 rounded-full border-2 border-white bg-primary shadow-md" />
        </button>
      </div>
      <p className="text-xs text-muted">
        {labels.coordinates}: {resolvedLatitude.toFixed(5)}, {resolvedLongitude.toFixed(5)}
      </p>
    </div>
  );
}
