import React, { ReactNode, useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { CityBuildings } from "@/types/types";
import { BuildingItem } from "./BuildingItem";

type IBuildings = {
  tileset: any;
  buildingData: any;
};

export default function Buildings({
  tileset,
  buildingData,
}: IBuildings): ReactNode {
  // Loading textures
  const textureLoader = useMemo(() => {
    let textObj;
    textObj = new TextureLoader().load("/textures/SID_BuildingSheet.png");
    textObj.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
    textObj.magFilter = NearestFilter;
    textObj.wrapS = RepeatWrapping;
    textObj.wrapT = RepeatWrapping;
    return textObj;
  }, []);

  return (
    <>
      {textureLoader &&
        buildingData.map((tileX: any, iY: number) => {
          return tileX.map((tileData: CityBuildings, iX: number) => {
            if (
              tileData === null ||
              tileData.tile === undefined ||
              tileData.tile === null
            ) {
              return null;
            }
            return (
              <BuildingItem
                key={`building-${iX}-${iY}`}
                tileset={tileset}
                textureLoader={textureLoader}
                tileData={tileData.tile}
                pos={{ posX: iX, posY: iY }}
              />
            );
          });
        })}
    </>
  );
}
