import { CityProps, pointLightProps } from "@/types/types";
import { pointLightsData, propsOffset } from "@/utils/constants";
import { getValFromCustomData } from "@/utils/landUtils";
import { memo, useMemo, useState } from "react";

type IElem = {
  tileset: any;
  pos: { posX: number; posY: number };
  tileData: CityProps;
  textureLoader: THREE.Texture;
  entity?: any;
};

const PropsItem = memo<IElem>(
  ({ tileset, tileData, pos, textureLoader, entity }): any => {
    const [localTexture, setLocalTexture] = useState<any>(null);
    // const [pointLight, setPointLight] = useState<pointLightProps | null>();
    const [offsetX, setOffsetX] = useState<number>(0);
    const [offsetY, setOffsetY] = useState<number>(0);

    const elemTexture = useMemo(() => {
      if (tileset && textureLoader) {
        const entity = tileData.entity;
        const localT = textureLoader.clone();
        localT.needsUpdate = true;

        let spritesPerRow = tileset.pxWid / tileset.tileGridSize; // 80 sprites per row : 1280/16
        let spritesPerColumn = tileset.pxHei / tileset.tileGridSize; // 80 sprites per column:  1280/16
        let xIndex = entity.tileRect.x / tileset.tileGridSize;
        let yIndex = entity.tileRect.y / tileset.tileGridSize;
        let xOffset = xIndex / spritesPerRow;
        let yOffset = 1 - (yIndex + entity.tileRect.h / 16) / spritesPerColumn; // Add 1 to yIndex because the y-axis starts from the bottom, not from the top
        localT.offset.set(xOffset, yOffset);

        localT.repeat.set(
          1 / (spritesPerRow / (entity.tileRect.w / tileset.tileGridSize)),
          1 / (spritesPerColumn / (entity.tileRect.h / tileset.tileGridSize))
        );

        setLocalTexture(localT);

        // set customData if we have some > especially pointLight
        // if (entity.customData) {
        //   const light = getValFromCustomData("pointLight", entity.customData);
        //   if (light) setPointLight(pointLightsData[light]);
        //   else setPointLight(null);
        // }

        // add offset depending on where props is placed on sidewalk
        if (tileData.corner) {
          const offset = propsOffset[entity.identifier][tileData.corner];
          setOffsetX(offset.x);
          setOffsetY(offset.y);
        }

        return localT;
      }
    }, [textureLoader, tileset, tileData]);

    return (
      <>
        <mesh
          position={[
            pos.posX + tileData.entity.tileRect.w / 32 + offsetX,
            // 0.22 + pos.posY * 0.02,
            0.22,
            pos.posY - tileData.entity.tileRect.h / 32 + offsetY,
          ]}
          name={`${tileData.entity.tileRect.tilesetUid}_props`.toString()}
          rotation={[-Math.PI * 0.5, 0, 0]}
        >
          <planeGeometry
            name={
              `${tileData.entity.tileRect.tilesetUid}_props`.toString() +
              "_geom"
            }
            attach="geometry"
            args={[
              tileData.entity.tileRect.w / 16,
              tileData.entity.tileRect.h / 16,
              1,
              1,
            ]}
          />
          <meshStandardMaterial
            attach="material"
            map={localTexture}
            name={
              `${tileData.entity.tileRect.tilesetUid}_props`.toString() + "_mat"
            }
            transparent={true}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>
        {/* {pointLight ? (
          <pointLight
            position={[
              pos.posX + tileData.entity.tileRect.w / 32 + offsetX,
              0.22 + pos.posY * 0.02 + pointLight?.z,
              pos.posY - tileData.entity.tileRect.h / 32 + offsetY - 0.5,
            ]}
            intensity={pointLight?.intensity}
            color={pointLight?.color}
          />
        ) : null} */}
      </>
    );
  }
);

PropsItem.displayName = "PropsItem";
export default PropsItem;
