import React, { ReactNode, useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import ResourceItem from "./Item";
import { CityBuilded } from "@/types/types";

type IGround = {
  tileset: any;
  cityData: any;
};

export default function Ground({ tileset, cityData }: IGround): ReactNode {
  // Loading textures
  const textureLoader = useMemo(() => {
    let textObj;
    textObj = new TextureLoader().load("/textures/SIDCity_TilesetSheet.png");
    textObj.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
    textObj.magFilter = NearestFilter;
    textObj.wrapS = RepeatWrapping;
    textObj.wrapT = RepeatWrapping;
    return textObj;
  }, []);

  return (
    <>
      {textureLoader &&
        cityData.map((tileX: any, iY: number) => {
          return tileX.map((tileData: CityBuilded, iX: number) => {
            if (tileData === null || tileData.tileId === undefined) {
              return null;
            }
            return (
              <ResourceItem
                key={`tile-${iX}-${iY}`}
                tileset={tileset}
                textureLoader={textureLoader}
                tileData={tileData}
                pos={{ posX: iX, posY: iY }}
              />
            );
          });
        })}
    </>
  );
}
