import React, { ReactNode } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter, Vector2 } from "three";
import { CityLight, TileData } from "@/types/types";
import { Tileset } from "@/types/ldtk";
import { useLoader } from "@react-three/fiber";
import LightItem from "./LightItem";
import { pointLightsData } from "@/constants/lights";

type IProps = {
  tilesets: Tileset[];
  lightData: any;
  tileData: TileData[];
};

export default function CityLights({
  tilesets,
  lightData,
  tileData,
}: IProps): ReactNode {
  const lightTexture = useLoader(
    TextureLoader,
    "/textures/SID_LightSources_Small.png"
  );
  const tileset = tilesets.find(
    (tileset: Tileset) => tileset.identifier === "SID_LightSources_Small"
  );
  if (!tileset) return;
  lightTexture.repeat = new Vector2(1 / tileset?.__cHei, 1 / tileset?.__cWid);
  lightTexture.magFilter = NearestFilter;
  lightTexture.wrapS = RepeatWrapping;
  lightTexture.wrapT = RepeatWrapping;

  return (
    <>
      {lightTexture &&
        lightData.map((light: CityLight, index: number) => {
          const type = pointLightsData[light.type].type;
          return (
            <LightItem
              key={`props-${index}`}
              tileset={tileset}
              textureLoader={lightTexture}
              light={light}
              tileData={tileData[type]}
            />
          );
        })}
    </>
  );
}
