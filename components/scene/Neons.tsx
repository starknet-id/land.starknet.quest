import React, {
  ReactNode,
  Ref,
  RefObject,
  createRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  Vector2,
  Mesh,
  Group,
  Object3D,
  BufferGeometry,
  Material,
} from "three";
import { CityBuildings } from "@/types/types";
import BuildingItem from "./BuildingItem";
import { Tileset } from "@/types/ldtk";
import { useFrame, useLoader } from "@react-three/fiber";
import NeonItem from "./NeonItem";
import {
  Bloom,
  EffectComposer,
  SelectiveBloom,
} from "@react-three/postprocessing";

type IBuildings = {
  tilesets: Tileset[];
  buildingData: any;
  windowWidth: number;
  windowHeight: number;
  ambientLight: any;
  directionalLight: any;
};

export default function Neons({
  tilesets,
  buildingData,
  windowWidth,
  windowHeight,
  ambientLight,
  directionalLight,
}: IBuildings): ReactNode {
  const neonGroup = useRef<Group>(null);
  // const [neonsRefs, setNeonsRefs] = useState<RefObject<Mesh>[]>([]);
  // const [selection, setSelection] = useState<Mesh[]>([]);
  const [selection, setSelection] = useState<
    Mesh<BufferGeometry, Material | Material[]>[]
  >([]);
  const neonTexture = useLoader(
    TextureLoader,
    "/textures/SID_BuildingSheetr_Neons.png"
  );
  const neonEmissive = useLoader(
    TextureLoader,
    "/textures/SID_BuildingSheetr_Neons_Emissive.png"
  );
  const tileset = tilesets[2];
  neonTexture.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
  neonTexture.magFilter = NearestFilter;
  neonTexture.wrapS = RepeatWrapping;
  neonTexture.wrapT = RepeatWrapping;

  neonEmissive.repeat = new Vector2(1 / tileset.__cHei, 1 / tileset.__cWid);
  neonEmissive.magFilter = NearestFilter;
  neonEmissive.wrapS = RepeatWrapping;
  neonEmissive.wrapT = RepeatWrapping;

  const nbBuildings = 3;
  // const [counter, setCounter] = useState(0);
  let counter = 0;

  const neonsRefs = useMemo(() => {
    const refs = [];
    for (let i = 0; i < nbBuildings; i++) {
      // refs.push(useRef<Mesh>());
      refs.push(
        // useRef<Mesh<BufferGeometry, Material | Material[]>>(new Mesh())
        createRef<Mesh<BufferGeometry, Material | Material[]>>()
      );
    }
    return refs;
  }, [nbBuildings]);

  useEffect(() => {
    if (!neonsRefs) return;
    const allRefsPopulated = neonsRefs.every((ref) => ref.current !== null);

    if (allRefsPopulated) {
      setSelection(
        neonsRefs
          .map((ref) => ref.current)
          .filter((mesh): mesh is Mesh => mesh !== undefined)
      );
    }
  }, [neonsRefs]);

  console.log("selection", selection);

  useFrame(() => {
    if (!neonGroup || !neonGroup.current) return;
    neonGroup.current.layers.enable(1);
  });

  // const addRef = (ref: RefObject<Mesh>) => {
  //   setNeonsRefs((prevNeonsRefs: RefObject<Mesh>[]) => [...prevNeonsRefs, ref]);
  // };

  // console.log("neonsRefs", neonsRefs);

  return (
    <>
      <EffectComposer>
        {/* 
        <SelectiveBloom
          lights={[ambientLight]} // ⚠️ REQUIRED! all relevant lights
          selection={selection}
          selectionLayer={1} // selection layer
          intensity={1.0} // The bloom intensity.
          // blurPass={undefined} // A blur pass.
          width={windowWidth} // render width
          height={windowHeight} // render height
          // kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={1.0} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
        /> */}
        <Bloom
          intensity={2.0} // The bloom intensity.
          // blurPass={undefined} // A blur pass.
          // kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={2} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.9} // smoothness of the luminance threshold. Range is [0, 1]
          mipmapBlur={true} // Enables or disables mipmap blur.
          // resolutionX={100} // The horizontal resolution.
          // resolutionY={100} // The vertical resolution.
          height={windowHeight}
          width={windowWidth}
        />
        <group ref={neonGroup}>
          {/* <ambientLight color="#FFFFFF" intensity={1} /> */}
          {neonTexture &&
            buildingData.map((tileX: any, iY: number) => {
              return tileX.map((tileData: CityBuildings, iX: number) => {
                if (
                  tileData === null ||
                  tileData.tile === undefined ||
                  tileData.tile === null
                ) {
                  return null;
                }
                // const ref = createRef<Object3D>();
                // ref.current?.layers.enable(1);
                // addRef(ref);
                const index = counter;
                counter++;
                // setCounter(counter + 1);
                return (
                  <NeonItem
                    ref={neonsRefs[index]}
                    key={`building-${iX}-${iY}`}
                    tileset={
                      tilesets.filter(
                        (tileset) => tileset.uid === tileData.tile.tilesetUid
                      )[0]
                    }
                    // textureLoader={neonTexture}
                    neonTexture={neonTexture}
                    neonEmissive={neonEmissive}
                    tileData={tileData.tile}
                    pos={{ posX: iX, posY: iY }}
                    // addRef={addRef}
                  />
                );
              });
            })}
        </group>
      </EffectComposer>
    </>
  );
}
