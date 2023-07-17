import React, { ReactNode } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { CityObjectsProps, CityProps, TileData } from "@/types/types";
import { Tileset } from "@/types/ldtk";
import PropsItem from "./PropItem";
import { useLoader } from "@react-three/fiber";
import PropItemMesh from "./PropItemMesh";

type IProps = {
  tilesets: Tileset[];
  cityData: any;
  propsData: Array<Array<CityObjectsProps>>;
  tileData: TileData[];
};

export default function CityProps({
  tilesets,
  cityData,
  propsData,
  tileData,
}: IProps): ReactNode {
  const buildingTexture = useLoader(
    TextureLoader,
    "/textures/SID_BuildingSheet.png"
  );
  const tileset = tilesets.find(
    (tileset: Tileset) => tileset.identifier === "SID_BuildingSheet"
  );
  buildingTexture.repeat = new Vector2(1 / 80, 1 / 80);
  buildingTexture.magFilter = NearestFilter;
  buildingTexture.wrapS = RepeatWrapping;
  buildingTexture.wrapT = RepeatWrapping;

  return (
    <>
      {/* {buildingTexture &&
        propsData.map((propData: CityObjectsProps[], index: number) => {
          if (propData.length === 0) return null;
          return propData.map((propData: CityObjectsProps, key: number) => {
            return (
              <PropItemMesh
                key={`props-${index}-${key}`}
                tileset={tileset}
                textureLoader={buildingTexture}
                propData={propData}
                index={index}
                tileData={tileData[index]}
              />
            );
          });
        })} */}
      {buildingTexture &&
        cityData.map((tileX: any, iY: number) => {
          return tileX.map((elem: CityProps, iX: number) => {
            if (elem === null) {
              return null;
            }
            return (
              <PropItemMesh
                key={`props-${iX}-${iY}`}
                tileset={tileset}
                textureLoader={buildingTexture}
                tileData={tileData[elem.entityType]}
                pos={{ posX: iX, posY: iY }}
                propData={elem}
              />
            );
          });
        })}
    </>
  );
}
