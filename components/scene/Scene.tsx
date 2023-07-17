import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { NoToneMapping, Vector2 } from "three";
import { Camera } from "./Camera";
import { LdtkReader } from "@/utils/parser";
import Ground from "./Ground";
import { iLDtk } from "@/types/ldtk";
import { CityLight } from "@/types/types";
import Buildings from "./Buildings";
import { Grid } from "@react-three/drei";
import { useGesture } from "react-use-gesture";
import CityProps from "./CityProps";
import { SelectiveBloom, EffectComposer } from "@react-three/postprocessing";
import { TerrainBackground } from "./TerrainBackground";
import { Perf } from "r3f-perf";
import { tileTypes } from "@/utils/constants";

type SceneProps = {
  address: string;
  userNft?: { [key: string]: boolean | number };
};

export const Scene: FunctionComponent<SceneProps> = ({ address, userNft }) => {
  const refCanvas = useRef<any>();
  const indexRef = useRef<any>();
  const [index, setIndex] = useState(20);
  indexRef.current = index;
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [mouseWheelProp, setMouseWheelProp] = useState(0);
  const [mouseRightPressed, setMouseRightPressed] = useState(0);
  const [isFirstTouch, setIsFirstTouch] = useState(false);

  const [data, setData] = useState<iLDtk>();
  const [cityData, setCityData] = useState<any>(null);
  const [propsData, setPropsData] = useState<any>(null); // todo: remove later
  const [cityProps, setProps] = useState<any>(null);
  const [buildingData, setBuildingData] = useState<any>(null);
  const [lightData, setLightData] = useState<any>(null);
  const [citySize, setCitySize] = useState(60);
  const [mapReader, setMapReader] = useState<any>(null);

  useEffect(() => {
    if (data) {
      // todo : calculate city size and number of blocks needed
      let mapReader = new LdtkReader(data, address, citySize, userNft);
      console.log("mapReader", mapReader);
      setMapReader(mapReader);

      let createTest = mapReader.CreateMap("Level_0", "SIDCity_TilesetSheet");
      console.log("createTest", createTest);

      setCityData(mapReader.cityBuilded);
      setPropsData(mapReader.cityProps);
      setBuildingData(mapReader.buildings);
      setLightData(mapReader.lights);
      setProps(mapReader.props);
    }
  }, [data]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    fetch("/data/SIDCity_Base_V5.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        console.log("jsonData", jsonData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // Controls
  useEffect(() => {
    const handleMouseWheelProp = (event: any) => {
      if (event.deltaY > 0 && indexRef.current > 8) {
        setIndex(() => indexRef.current - 1);
      } else if (event.deltaY < 0 && indexRef.current < 25) {
        setIndex(() => indexRef.current + 1);
      }
    };
    const passiveObject: any = { passive: true };
    document.addEventListener("wheel", handleMouseWheelProp, passiveObject);
    return () => {
      const passiveObject: any = { passive: true };
      document.removeEventListener(
        "wheel",
        handleMouseWheelProp,
        passiveObject
      );
    };
  }, []);

  const bind = useGesture(
    {
      onDrag: ({
        first,
        down,
        event,
        offset: [ox, oy],
        xy: [x, y],
        pinching,
        cancel,
      }) => {
        if (first) setIsFirstTouch(true);
        else setIsFirstTouch(false);
        if (pinching) return cancel();
        if (down) {
          setMouseRightPressed(1);
        } else {
          setMouseRightPressed(0);
        }
      },
    },
    { eventOptions: { passive: true } }
  );

  return (
    <>
      <Canvas
        id="canvasScene"
        gl={{ antialias: false, toneMapping: NoToneMapping }}
        linear
        ref={refCanvas}
        {...bind()}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        {/* <Perf position="top-left" style={{ marginLeft: "20px" }} /> */}
        <color attach="background" args={["#1a1528"]} />
        {/* <EffectComposer> */}
        {/* <SelectiveBloom
          lights={[lightRef1, lightRef2]} // ⚠️ REQUIRED! all relevant lights
          selection={[meshRef1, meshRef2]} // selection of objects that will have bloom effect
          selectionLayer={10} // selection layer
          intensity={1.0} // The bloom intensity.
          // blurPass={undefined} // A blur pass.
          width={windowWidth} // render width
          height={windowHeight} // render height
          // kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
        /> */}
        {/* </EffectComposer> */}
        <directionalLight color="#1b1a34" intensity={5} />
        <ambientLight color="#9902fc" intensity={0.1} />

        <Camera
          aspect={windowWidth / windowHeight}
          mouseRightPressed={mouseRightPressed}
          index={index}
          citySize={citySize}
          isFirstTouch={isFirstTouch}
        />
        {/* <Grid
          position={[citySize / 2, 0.22, citySize / 2]}
          args={[citySize, citySize]}
          cellSize={16}
          // cellThickness={1}
          cellColor="#6f6f6f"
          // sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 }
          // sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 }
          sectionColor="#9d4b4b"
          // fadeDistance: { value: 25, min: 0, max: 100, step: 1 },
          // fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
          // followCamera: false,
          infiniteGrid={true}
        /> */}

        {data && cityData ? (
          <Ground tileset={data?.defs.tilesets[0]} cityData={cityData} />
        ) : null}

        {data && propsData ? (
          <CityProps
            tilesets={data?.defs.tilesets}
            cityData={propsData}
            propsData={cityProps}
            tileData={mapReader.tileData[tileTypes.PROPS]}
          />
        ) : null}

        {data && buildingData ? (
          <Buildings
            tilesets={data?.defs.tilesets}
            buildingData={buildingData}
          />
        ) : null}

        {data && lightData
          ? lightData.map((light: CityLight, index: number) => {
              const z = light.props ? light.props.z : 0.6;
              return (
                <pointLight
                  key={`light_${light.posX}_${light.posY}_${index}`}
                  position={[light.posX, z, light.posY]}
                  {...light.props}
                  castShadow={false}
                />
              );
            })
          : null}
        <TerrainBackground />
      </Canvas>
    </>
  );
};
