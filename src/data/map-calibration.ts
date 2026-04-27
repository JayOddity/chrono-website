// Atlas calibration for the Setera world map. The overview image
// (/images/map/setar/overview.webp) and the tile pyramid both cover the same
// world rectangle below, so these values let a server component or static
// renderer project world coordinates onto either backdrop.
//
// IMPORTANT: these must match DEFAULT_ATLAS_CALIBRATION in src/app/map/InteractiveMap.tsx.
// The values are user-calibrated from landmark pins and are considered frozen.

export interface AtlasCalibration {
  worldMinX: number;
  worldMaxX: number;
  worldMinY: number;
  worldMaxY: number;
}

export const DEFAULT_ATLAS_CALIBRATION: AtlasCalibration = {
  worldMinX: -375944.5008950393,
  worldMaxX:  402810.4122176751,
  worldMinY: -382038.551519923,
  worldMaxY:  484309.70172175916,
};

/** Convert world (x, y) to atlas UV in [0, 1]. Image v=0 is TOP (low world Y). */
export function worldToUV(
  wx: number,
  wy: number,
  cal: AtlasCalibration = DEFAULT_ATLAS_CALIBRATION,
): { u: number; v: number } {
  return {
    u: (wx - cal.worldMinX) / (cal.worldMaxX - cal.worldMinX),
    v: (wy - cal.worldMinY) / (cal.worldMaxY - cal.worldMinY),
  };
}
