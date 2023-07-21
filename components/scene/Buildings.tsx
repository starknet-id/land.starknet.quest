import React, {
  ReactNode,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  Vector2,
  Mesh,
} from "three";
import { CityBuildings } from "@/types/types";
import BuildingItem from "./BuildingItem";
import { Tileset } from "@/types/ldtk";
import { useLoader } from "@react-three/fiber";

type IBuildings = {
  tilesets: Tileset[];
  buildingData: any;
  nightMode: boolean;
};

export default function Buildings({
  tilesets,
  buildingData,
  nightMode,
}: IBuildings): ReactNode {
  const buildingTexture = useLoader(
    TextureLoader,
    "/textures/SID_BuildingSheet.png"
  );
  const neonTexture = useLoader(
    TextureLoader,
    "/textures/SID_BuildingSheetr_Neons.png"
  );
  const tileset = tilesets[2];
  buildingTexture.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
  buildingTexture.magFilter = NearestFilter;
  buildingTexture.wrapS = RepeatWrapping;
  buildingTexture.wrapT = RepeatWrapping;

  neonTexture.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
  neonTexture.magFilter = NearestFilter;
  neonTexture.wrapS = RepeatWrapping;
  neonTexture.wrapT = RepeatWrapping;

  return (
    <>
      {buildingTexture &&
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
                textureLoader={buildingTexture}
                neonTexture={neonTexture}
                tileData={tileData.tile}
                pos={{ posX: iX, posY: iY }}
                nightMode={nightMode}
              />
            );
          });
        })}
    </>
  );
}
