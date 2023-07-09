import { CityBuilded } from "@/types/types";
import { useFrame } from "@react-three/fiber";
import { memo, useEffect, useMemo, useRef, useState } from "react";

type IElem = {
  tileset: any;
  pos: { posX: number; posY: number };
  tileData: CityBuilded;
  textureLoader: THREE.Texture;
  entity?: any;
};

export const ResourceItem = memo<IElem>(
  ({ tileset, tileData, pos, textureLoader, entity }): any => {
    const meshRef = useRef<any>();
    const [localTexture, setLocalTexture] = useState<any>(null);

    const elemTexture = useMemo(() => {
      if (tileset && textureLoader) {
        const localT = textureLoader.clone();
        localT.needsUpdate = true;

        let spritesPerRow = tileset.pxWid / tileset.tileGridSize; // 40 sprites per row : 640/16
        let spritesPerColumn = tileset.pxHei / tileset.tileGridSize; // 40 sprites per column:  640/16
        let xIndex = tileData.tileId % spritesPerRow;
        let yIndex = Math.floor(tileData.tileId / spritesPerColumn);
        // Texture coordinates are normalized between 0 and 1. We divide by the number of sprites per row or column to get the offset.
        let xOffset = xIndex / spritesPerRow;
        let yOffset = 1 - (yIndex / spritesPerColumn + 1 / spritesPerColumn);
        localT.offset.set(xOffset, yOffset);
        setLocalTexture(localT);
        return localT;
      }
    }, [textureLoader, tileset]);

    useFrame(() => {
      if (!meshRef || !meshRef.current) {
        return;
      }

      if (meshRef.current && localTexture) {
        if (tileData.flipX) {
          meshRef.current.scale.x = -1;
        } else {
          meshRef.current.scale.x = 1;
        }
        if (tileData.flipY) {
          meshRef.current.scale.y = -1;
        } else {
          meshRef.current.scale.y = 1;
        }
      }
    });

    return (
      <>
        <mesh
          ref={meshRef}
          position={[pos.posX + 0.5, 0.22, pos.posY - 0.5]}
          // position={[pos.posX + 0.5, 0.22 + pos.posY * 0.02, pos.posY - 0.5]}
          name={`nameblock`.toString()}
          rotation={[-Math.PI * 0.5, 0, 0]}
        >
          <planeGeometry
            name={`nameblock`.toString() + "_geom"}
            attach="geometry"
            args={[1, 1, 1, 1]}
          />
          <meshStandardMaterial
            attach="material"
            map={elemTexture}
            name={`$nameblock`.toString() + "_mat"}
            transparent={true}
            depthWrite={false}
            depthTest={true}
          />
        </mesh>
      </>
    );
  }
);
