import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { NoToneMapping, Vector2 } from "three";
import { Camera } from "./Camera";
import { getGridPositionFromTileset } from "@/utils/def";
import { Grid } from "@react-three/drei";
import { LdtkReader } from "@/utils/parser";
import Ground from "./Ground";
import { iLDtk } from "@/types/ldtk";

type SceneProps = {
  address: string;
};

export const Scene: FunctionComponent<SceneProps> = ({ address }) => {
  const refCanvas = useRef<any>();
  const indexRef = useRef<any>();
  const [index, setIndex] = useState(10);
  indexRef.current = index;

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  const [keyMap, setKeyMap] = useState({
    Escape: false,
    KeyD: false,
  });
  const [mouseWheelProp, setMouseWheelProp] = useState(0);
  const [mouseLeftPressed, setMouseLeftPressed] = useState(0);
  const [mouseRightPressed, setMouseRightPressed] = useState(0);
  const [mouseMiddlePressed, setMouseMiddlePressed] = useState(0);
  const [customMouse, setCustomMouse] = useState(new Vector2(0, 0));

  const [data, setData] = useState<iLDtk>();
  const [landTilesets, setLandTilesets] = useState<any>(null);
  const [entities, setEntities] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [citySize, setCitySize] = useState(140);

  useEffect(() => {
    if (data) {
      // todo : calculate city size and number of blocks needed
      let mapReader = new LdtkReader(data, address, citySize);
      console.log("mapReader", mapReader);

      let createTest = mapReader.CreateMap("Level_0", "SIDCity_TilesetSheet");
      console.log("createTest", createTest);

      setCityData(mapReader.cityBuilded);
    }
  }, [data]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    fetch("/data/SIDCity_Base_V2.json")
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

  useEffect(() => {
    if (data) {
      const landTilesets = getGridPositionFromTileset(data.defs.tilesets);
      setLandTilesets(landTilesets);
      console.log("data", data);
      setEntities(data.defs.entities);
    }
  }, [data]);

  // Controls
  useEffect(() => {
    const handleKeyDown = (event: any) => {
      setKeyMap((m) => ({ ...m, [event.code]: true }));
    };
    const handleKeyUp = (event: any) => {
      setKeyMap((m) => ({ ...m, [event.code]: false }));
    };
    const handleMouseWheelProp = (event: any) => {
      if (event.deltaY > 0 && indexRef.current > 4) {
        setIndex(() => indexRef.current - 1);
      } else if (event.deltaY < 0 && indexRef.current < 20) {
        setIndex(() => indexRef.current + 1);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    const passiveObject: any = { passive: true };
    document.addEventListener("wheel", handleMouseWheelProp, passiveObject);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      const passiveObject: any = { passive: true };
      document.removeEventListener(
        "wheel",
        handleMouseWheelProp,
        passiveObject
      );
    };
  }, []);

  return (
    <>
      <Canvas
        id="canvasScene"
        gl={{ antialias: true, toneMapping: NoToneMapping }}
        linear
        ref={refCanvas}
        onCreated={() => {
          //   setFrontBlockArray(mapArray);
        }}
        onMouseDown={(event) => {
          if (event.button == 2) {
            setMouseRightPressed(1);
          }
          if (event.button == 0) {
            event.preventDefault;
            setMouseLeftPressed(1);
          }
          if (event.button == 1) {
            setMouseMiddlePressed(1);
          }
        }}
        onMouseUp={(event) => {
          event.stopPropagation();
          if (event.button == 2) {
            setMouseRightPressed(0);
          }
          if (event.button == 0) {
            event.preventDefault;
            setMouseLeftPressed(0);
          }
          if (event.button == 1) {
            setMouseMiddlePressed(0);
          }
        }}
        onMouseMove={(event) => {
          setCustomMouse(
            new Vector2(
              (event.clientX / window.innerWidth) * 2 - 1,
              -(event.clientY / window.innerHeight) * 2 + 1
            )
          );
        }}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        <ambientLight color={0xffffff} intensity={0.9} />
        <directionalLight
          color={0xffffff}
          intensity={0.5}
          position={[12, 12, 8]}
        />
        <color attach="background" args={[0x73bed3]} />
        <Camera
          aspect={windowWidth / windowHeight}
          mouseRightPressed={mouseRightPressed}
          mouseWheelProp={mouseWheelProp}
          index={index}
          citySize={citySize}
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
        {/* {entities &&
          entities.map((entity: any) => {
            return (
              <ResourceItem
                tileset={landTilesets}
                entity={entity}
                pos={{ posX: 20, posY: 8 }}
              />
            );
          })} */}
        {data && cityData ? (
          <Ground tileset={data?.defs.tilesets[0]} cityData={cityData} />
        ) : null}
        {/* <TerrainBackground />
        <Terrain />
        <TerrainBorder /> */}
      </Canvas>
    </>
  );
};
