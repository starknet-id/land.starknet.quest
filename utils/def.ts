import { Tileset } from "@/types/ldtk";

export const getGridPositionFromTileset = (tilesets: Tileset[]): any[] => {
  // todo : define custom type here
  let landTilesets: any[] = [];
  // pour chaque tileset ensuite pour chaque customData calculate sprite position
  tilesets.forEach((tileset: any) => {
    console.log("tileset", tileset);

    landTilesets[tileset.uid] = [];
    landTilesets[tileset.uid].identifier = tileset.identifier;
    landTilesets[tileset.uid].gridData = [];

    tileset.customData.forEach((customData: any) => {
      console.log("customData", customData);
      const { pixelTileX, pixelTileY, gridTileX, gridTileY } =
        getPositionFromTileId(tileset, customData);

      landTilesets[tileset.uid].gridData.push({
        pixelTileX: pixelTileX,
        pixelTileY: pixelTileY,
        gridTileX: gridTileX,
        gridTileY: gridTileY,
      });

      console.log("pixelTileX", pixelTileX);
      console.log("pixelTileY", pixelTileY);
      console.log("gridTileX", gridTileX);
      console.log("gridTileY", gridTileY);
    });
  });
  return landTilesets;
};

export const getPositionFromTileId = (
  tileset: Tileset,
  customData: { data: string; tileId: number }
): {
  pixelTileX: number;
  pixelTileY: number;
  gridTileX: number;
  gridTileY: number;
} => {
  const atlasGridBaseWidth = tileset.__cWid;

  // Get "grid-based" coordinate of the tileId
  const gridTileX =
    customData.tileId -
    atlasGridBaseWidth *
      parseInt((customData.tileId / atlasGridBaseWidth).toFixed(0));
  // Get the atlas pixel coordinate
  const pixelTileX =
    tileset.padding + gridTileX * (tileset.tileGridSize + tileset.spacing);

  // Get "grid-based" coordinate of the tileId
  const gridTileY = parseInt(
    (customData.tileId / atlasGridBaseWidth).toFixed(0)
  );
  // Get the atlas pixel coordinate
  const pixelTileY =
    tileset.padding + gridTileY * (tileset.tileGridSize + tileset.spacing);

  return { pixelTileX, pixelTileY, gridTileX, gridTileY };
};
