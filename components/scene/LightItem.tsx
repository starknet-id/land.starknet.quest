import { CityLight, TileData } from "@/types/types";
import { memo, useMemo, useState } from "react";
import {
  AddEquation,
  CustomBlending,
  DstAlphaFactor,
  MaxEquation,
  MinEquation,
  OneFactor,
  OneMinusDstAlphaFactor,
  OneMinusSrcAlphaFactor,
  SrcAlphaFactor,
} from "three";

type IElem = {
  tileset: any;
  textureLoader: THREE.Texture;
  tileData: TileData;
  light: CityLight;
};

const LightItem = memo<IElem>(
  ({ tileset, textureLoader, tileData, light }): any => {
    const [offset, setOffset] = useState<{ x: number; y: number; z: number }>({
      x: 0,
      y: 0,
      z: 0,
    });

    const elemTexture = useMemo(() => {
      if (tileset && textureLoader) {
        const localT = textureLoader.clone();
        localT.needsUpdate = true;
        localT.offset.set(tileData.textureOffset.x, tileData.textureOffset.y);
        localT.repeat.set(tileData.textureRepeat.x, tileData.textureRepeat.y);
        return localT;
      }
    }, [textureLoader, tileset]);

    return (
      <mesh
        position={[
          light.posX + offset.x,
          0.3 + light.posY * 0.02,
          light.posY - 1 + offset.y,
        ]}
        name={`${tileData.entity.tileRect.tilesetUid}_props`.toString()}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry
          name={
            `${tileData.entity.tileRect.tilesetUid}_props`.toString() + "_geom"
          }
          attach="geometry"
          args={[tileData.plane.w, tileData.plane.h, 1, 1]}
        />
        <meshBasicMaterial
          attach="material"
          map={elemTexture}
          name={
            `${tileData.entity.tileRect.tilesetUid}_props`.toString() + "_mat"
          }
          transparent={true}
          depthWrite={false}
          depthTest={true}
          blending={CustomBlending}
          blendEquation={AddEquation}
          blendSrc={SrcAlphaFactor}
          // blendDst={OneFactor}
          // blendEquationAlpha={MaxEquation}
          // opacity={0.5}
        />
      </mesh>
    );
  }
);

LightItem.displayName = "LightItem";
export default LightItem;
