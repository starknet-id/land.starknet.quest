import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { NoToneMapping } from "three";
import { Camera } from "./Camera";
import { LdtkReader } from "@/utils/parser";
import Ground from "./Ground";
import { iLDtk } from "@/types/ldtk";
import Buildings from "./Buildings";
import { useGesture } from "react-use-gesture";
import CityProps from "./CityProps";
import { TerrainBackground } from "./TerrainBackground";
import { Perf } from "r3f-perf";
import { tileTypes } from "@/utils/constants";
import { CityLight } from "@/types/types";
import LightItem from "./LightItem";
import CityLights from "./CityLights";
import ZoomButtons from "./UI/zoomButtons";

type SceneProps = {
  address: string;
  userNft: { [key: string]: boolean | number };
  nightMode: boolean;
};

export const Scene: FunctionComponent<SceneProps> = ({
  address,
  userNft,
  nightMode,
}) => {
  const refCanvas = useRef<any>();
  const indexRef = useRef<any>();
  const [index, setIndex] = useState(20);
  indexRef.current = index;
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  // const [mouseWheelProp, setMouseWheelProp] = useState(0);
  const [mouseRightPressed, setMouseRightPressed] = useState(0);
  const [isFirstTouch, setIsFirstTouch] = useState(false);

  // const ambiantLightRef = useRef<any>();
  // const directionalLightRef = useRef<any>(null);
  // const [neonsRefs, setNeonsRefs] = useState<any[]>([]);
  // const neonGroup = useRef<any>();

  const [data, setData] = useState<iLDtk>();
  const [cityData, setCityData] = useState<any>(null);
  const [propsData, setPropsData] = useState<any>(null);
  const [cityProps, setProps] = useState<any>(null);
  const [buildingData, setBuildingData] = useState<any>(null);
  const [lightData, setLightData] = useState<any>(null);
  const [citySize, setCitySize] = useState(100);
  const [mapReader, setMapReader] = useState<any>(null);

  useEffect(() => {
    if (data) {
      let mapReader = new LdtkReader(data, address, citySize, userNft);
      console.log("mapReader", mapReader);
      setMapReader(mapReader);

      let createTest = mapReader.CreateMap("Level_0", "SIDCity_TilesetSheet");

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
      })
      .catch((error) => console.error("Error:", error));
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
    }
    // { eventOptions: { passive: true } }
  );

  const handleMouseWheelProp = (zoom: boolean) => {
    if (!zoom && indexRef.current < 25) {
      setIndex(() => indexRef.current + 1);
    } else if (zoom && indexRef.current > 8) {
      setIndex(() => indexRef.current - 1);
    }
  };

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
        {nightMode ? (
          <directionalLight color="#1b1a34" intensity={5} />
        ) : (
          <directionalLight color="#ffffff" intensity={1} />
        )}
        <ambientLight color="#9902fc" intensity={0.1} />
        <Camera
          aspect={windowWidth / windowHeight}
          mouseRightPressed={mouseRightPressed}
          index={index}
          citySize={citySize}
          isFirstTouch={isFirstTouch}
        />
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
            nightMode={nightMode}
          />
        ) : null}
        {/* {data && buildingData ? (
          <Neons
            tilesets={data?.defs.tilesets}
            buildingData={buildingData}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
          />
        ) : null} */}
        {/* {data && buildingData ? (
          <Neons
            tilesets={data?.defs.tilesets}
            buildingData={buildingData}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            ambientLight={ambiantLightRef}
            directionalLight={directionalLightRef}
          />
        ) : null} */}
        {/* {data && lightData ? (
          <CityLights
            tilesets={data?.defs.tilesets}
            tileData={mapReader.tileData[tileTypes.LIGHTS]}
            lightData={lightData}
          />
        ) : null} */}
        {nightMode && data && lightData
          ? lightData.map((light: CityLight, index: number) => {
              const z = light.props ? light.props.z : 0.6;
              return (
                <pointLight
                  key={`light_${light.posX}_${light.posY}_${index}`}
                  position={[light.posX, 0.6 + light.posY * 0.02, light.posY]}
                  // {...light.props}
                  intensity={light.props?.intensity}
                  color={light.props?.color}
                  distance={light.props?.distance}
                  decay={light.props?.decay}
                  power={light.props?.power}
                  castShadow={false}
                />
              );
            })
          : null}
        <TerrainBackground />
      </Canvas>
      <ZoomButtons handleMouseWheelProp={handleMouseWheelProp} />
    </>
  );
};
