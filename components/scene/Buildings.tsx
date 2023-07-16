import React, { ReactNode, useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { CityBuildings } from "@/types/types";
import BuildingItem from "./BuildingItem";
import { Tileset } from "@/types/ldtk";

type IBuildings = {
  tilesets: Tileset[];
  buildingData: any;
};

export default function Buildings({
  tilesets,
  buildingData,
}: IBuildings): ReactNode {
  // Loading textures
  const textureLoader = useMemo(() => {
    let textures: any[] = [];
    tilesets.forEach((tileset) => {
      if (tileset.uid !== 1) {
        let textObj;
        textObj = new TextureLoader().load(
          `/textures/${tileset.identifier}.png`
        );
        textObj.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
        textObj.magFilter = NearestFilter;
        textObj.wrapS = RepeatWrapping;
        textObj.wrapT = RepeatWrapping;
        textures[tileset.uid] = textObj;
      }
    });
    return textures;
  }, []);

  const neonTexture = useMemo(() => {
    let textObj;
    textObj = new TextureLoader().load(
      "/textures/SID_BuildingSheetr_Neons.png"
    );
    textObj.repeat = new Vector2(1 / 80, 1 / 80);
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
                tileset={
                  tilesets.filter(
                    (tileset) => tileset.uid === tileData.tile.tilesetUid
                  )[0]
                }
                textureLoader={textureLoader[tileData.tile.tilesetUid]}
                neonTexture={neonTexture}
                tileData={tileData.tile}
                pos={{ posX: iX, posY: iY }}
              />
            );
          });
        })}
    </>
  );
}
