import React, { ReactNode, useMemo, useState } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { CityProps } from "@/types/types";
import { Tileset } from "@/types/ldtk";
import PropsItem from "./PropItem";

type IProps = {
  tilesets: Tileset[];
  cityData: any;
};

export default function CityProps({ tilesets, cityData }: IProps): ReactNode {
  const [tileset, setTileset] = useState<Tileset | null>();
  // Loading textures
  const textureLoader = useMemo(() => {
    let propsTileset = tilesets.find(
      (tileset: Tileset) => tileset.identifier === "SID_BuildingSheet"
    );
    setTileset(propsTileset);
    if (!propsTileset) return null;
    let textObj;
    textObj = new TextureLoader().load(
      "/textures/" + propsTileset.identifier + ".png"
    );
    textObj.repeat = new Vector2(
      1 / propsTileset.__cHei,
      1 / propsTileset.__cWid
    );
    textObj.magFilter = NearestFilter;
    textObj.wrapS = RepeatWrapping;
    textObj.wrapT = RepeatWrapping;
    return textObj;
  }, []);

  return (
    <>
      {textureLoader &&
        cityData.map((tileX: any, iY: number) => {
          return tileX.map((tileData: CityProps, iX: number) => {
            if (tileData === null) {
              return null;
            }
            return (
              <PropsItem
                key={`props-${iX}-${iY}`}
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
