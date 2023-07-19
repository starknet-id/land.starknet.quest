import { TileRect } from "@/types/ldtk";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, SelectiveBloom } from "@react-three/postprocessing";
import React, {
  ForwardRefRenderFunction,
  Ref,
  RefObject,
  createRef,
  useEffect,
  useRef,
} from "react";
import { memo, useMemo, useState } from "react";
import { AdditiveBlending, Mesh, Object3D, PlaneGeometry } from "three";

type IElem = {
  tileset: any;
  pos: { posX: number; posY: number };
  tileData: TileRect;
  neonTexture: THREE.Texture;
  neonEmissive: THREE.Texture;
  // addRef: (ref: RefObject<Mesh>) => void;
};

const NeonItem = memo(
  React.forwardRef<Mesh, IElem>(
    (
      {
        tileset,
        tileData,
        pos,
        neonTexture,
        neonEmissive,
        // addRef,
      },
      ref
    ): any => {
      const [offset, setOffset] = useState<any>(null);
      const [repeat, setRepeat] = useState<any>(null);
      // const ref = React.createRef<Mesh>();
      // ref.current?.layers.enable(1);

      const elemTexture = useMemo(() => {
        if (tileset && neonTexture) {
          const localT = neonTexture.clone();
          localT.needsUpdate = true;

          let spritesPerRow = tileset.pxWid / tileset.tileGridSize; // 80 sprites per row : 1280/16
          let spritesPerColumn = tileset.pxHei / tileset.tileGridSize; // 80 sprites per column:  1280/16
          let xIndex = tileData.x / tileset.tileGridSize;
          let yIndex = tileData.y / tileset.tileGridSize;
          let xOffset = xIndex / spritesPerRow;
          let yOffset = 1 - (yIndex + tileData.h / 16) / spritesPerColumn; // Add 1 to yIndex because the y-axis starts from the bottom, not from the top

          localT.offset.set(xOffset, yOffset);
          localT.repeat.set(
            1 / (spritesPerRow / (tileData.w / tileset.tileGridSize)),
            1 / (spritesPerColumn / (tileData.h / tileset.tileGridSize))
          );

          setOffset({ x: xOffset, y: yOffset });
          setRepeat({
            x: 1 / (spritesPerRow / (tileData.w / tileset.tileGridSize)),
            y: 1 / (spritesPerColumn / (tileData.h / tileset.tileGridSize)),
          });
          return localT;
        }
      }, [neonTexture, tileset, tileData]);

      // const neon = useMemo(() => {
      //   if (tileset && neonTexture && offset && repeat) {
      //     const localT = neonTexture.clone();
      //     localT.needsUpdate = true;

      //     localT.offset.set(offset.x, offset.y);
      //     localT.repeat.set(repeat.x, repeat.y);

      //     // addRef(ref);
      //     return localT;
      //   }
      // }, [neonTexture, tileset, tileData, repeat, offset]);

      const plane = useMemo(() => {
        return new PlaneGeometry(tileData.w / 16, tileData.h / 16, 1, 1);
      }, [tileData]);

      useFrame(() => {
        if (!ref) return;
        //@ts-ignore
        ref.current?.position.set(
          pos.posX + tileData.w / 32,
          0.22,
          pos.posY - tileData.h / 32
        );
        //@ts-ignore
        ref.current?.updateMatrix();
      });

      return (
        <>
          {/* <EffectComposer>
            <SelectiveBloom
              lights={[]} // ⚠️ REQUIRED! all relevant lights
              //@ts-ignore
              selection={ref && ref.current ? [ref.current] : []} // ⚠️ REQUIRED! all relevant objects
              selectionLayer={1} // selection layer
              intensity={10.0} // The bloom intensity.
              // blurPass={undefined} // A blur pass.
              width={300} // render width
              height={300} // render height
              // kernelSize={KernelSize.LARGE} // blur kernel size
              luminanceThreshold={1.0} // luminance threshold. Raise this value to mask out darker elements in the scene.
              luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
            />
          </EffectComposer> */}
          <mesh
            ref={ref}
            position={[
              pos.posX + tileData.w / 32,
              0.22,
              pos.posY - tileData.h / 32,
            ]}
            name={`${tileData.tilesetUid}_building_neon`.toString()}
            rotation={[-Math.PI * 0.5, 0, 0]}
            geometry={plane}
          >
            <meshBasicMaterial
              attach="material"
              map={elemTexture}
              name={`${tileData.tilesetUid}_building_neon`.toString() + "_mat"}
              transparent={true}
              depthWrite={false}
              depthTest={false}
            />
            {/* <meshBasicMaterial
              attach="material1"
              map={neonTexture}
              name={`${tileData.tilesetUid}_building_neon`.toString() + "_mat"}
              // transparent={true}
              // depthWrite={false}
              // depthTest={false}
              toneMapped={false}
              color={[2, 0, 0]}
            /> */}
            {/* <meshStandardMaterial
              attach="material"
              map={neonTexture}
              name={`${tileData.tilesetUid}_building_neon`.toString() + "_mat"}
              // transparent={true}
              // depthWrite={false}
              // depthTest={false}
              toneMapped={false}
              emissive={"red"}
              color={"red"}
            /> */}
            {/* <meshBasicMaterial
              attach="material"
              // transparent={true}
              // depthWrite={false}
              // depthTest={true}
              toneMapped={false}
              // emissiveMap={neonEmissive}
              // emissive={"red"}
              // emissiveIntensity={10}
              color={[2, 0, 0]}
            />  */}
            {/* <meshStandardMaterial
              attach="material"
              // transparent={true}
              depthWrite={false}
              depthTest={true}
              toneMapped={false}
              emissiveMap={neonEmissive}
              emissive={"red"}
              emissiveIntensity={10}
            /> */}
          </mesh>
          {/* <mesh
            ref={ref}
            position={[
              pos.posX + tileData.w / 32,
              0.3,
              pos.posY - tileData.h / 32,
            ]}
            name={`${tileData.tilesetUid}_building_neon`.toString()}
            rotation={[-Math.PI * 0.5, 0, 0]}
            geometry={plane}
          > */}
          {/* <meshStandardMaterial
              attach="material"
              // transparent={true}
              // depthWrite={false}
              // depthTest={true}
              toneMapped={false}
              emissiveMap={neonEmissive}
              emissive={"red"}
              emissiveIntensity={1}
            /> */}
          {/* <meshBasicMaterial
              attach="material"
              map={neonEmissive}
              name={`${tileData.tilesetUid}_building_neon`.toString() + "_mat"}
              toneMapped={false}
              color={"red"}
            /> */}
          {/* <meshStandardMaterial
              attach="material"
              // transparent={true}
              // depthWrite={false}
              // depthTest={true}
              toneMapped={false}
              emissiveMap={neonEmissive}
              emissive={"red"}
              emissiveIntensity={100}
            />
          </mesh>
          {/* <mesh
            ref={ref}
            position={[
              pos.posX + tileData.w / 32,
              0.22,
              pos.posY - tileData.h / 32,
            ]}
            name={`${tileData.tilesetUid}_building_neon`.toString()}
            rotation={[-Math.PI * 0.5, 0, 0]}
            geometry={plane}
          >
            {/* <meshBasicMaterial
              attach="material"
              map={neonEmissive}
              name={`${tileData.tilesetUid}_building_neon`.toString() + "_mat"}
              transparent={true}
              depthWrite={false}
              depthTest={true}
              toneMapped={false}
              // emissiveMap={neonEmissive}
              // emissive={"red"}
              // emissiveIntensity={1}
              color={[2, 0, 0]}
            /> */}
          {/* <meshPhysicalMaterial
              attach="material"
              transparent={true}
              depthWrite={false}
              depthTest={true}
              toneMapped={false}
              emissiveMap={neonEmissive}
              emissive={"red"}
              emissiveIntensity={1}
            />
          </mesh> */}
          {/* </mesh> */}
        </>
      );
    }
  )
);

NeonItem.displayName = "NeonItem";
export default NeonItem;
