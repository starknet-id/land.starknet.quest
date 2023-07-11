import { Canvas } from "@react-three/fiber";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { NoToneMapping, Vector2 } from "three";
import { Camera } from "./Camera";
import { LdtkReader } from "@/utils/parser";
import Ground from "./Ground";
import { iLDtk } from "@/types/ldtk";
import { AspectNftProps } from "@/types/types";
import Buildings from "./Buildings";
import { Grid } from "@react-three/drei";
import { useGesture } from "react-use-gesture";

type SceneProps = {
  address: string;
  userNft: AspectNftProps[];
};

export const Scene: FunctionComponent<SceneProps> = ({ address, userNft }) => {
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
  const [buildingData, setBuildingData] = useState<any>(null);
  const [citySize, setCitySize] = useState(60);
  const [nftArray, setNftArray] = useState<any>(null);

  useEffect(() => {
    if (data) {
      // todo : calculate city size and number of blocks needed
      let mapReader = new LdtkReader(data, address, citySize, userNft);
      console.log("mapReader", mapReader);

      let createTest = mapReader.CreateMap("Level_0", "SIDCity_TilesetSheet");
      console.log("createTest", createTest);

      setCityData(mapReader.cityBuilded);
      setBuildingData(mapReader.buildings);
    }
  }, [data]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    fetch("/data/SIDCity_Base_V3.json")
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
    const NFTArray = {
      0: {
        name: "NFT_0",
        tileUid: 5,
      },
      1: {
        name: "NFT_0",
        tileUid: 5,
      },
      2: {
        name: "NFT_0",
        tileUid: 4,
      },
      3: {
        name: "NFT_0",
        tileUid: 4,
      },
      4: {
        name: "NFT_0",
        tileUid: 3,
      },
      5: {
        name: "NFT_0",
        tileUid: 3,
      },
      6: {
        name: "NFT_0",
        tileUid: 3,
      },
      7: {
        name: "NFT_0",
        tileUid: 3,
      },
      8: {
        name: "NFT_0",
        tileUid: 2,
      },
      9: {
        name: "NFT_0",
        tileUid: 2,
      },
    };
    setNftArray(NFTArray);
  }, []);

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

  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my], tap, swipe: [sx] }) => {
      setCustomMouse(
        new Vector2(
          (mx / window.innerWidth) * 2 - 1,
          -(my / window.innerHeight) * 2 + 1
        )
      );

      // Left mouse button equivalents
      if (tap) {
        setMouseLeftPressed(down ? 1 : 0);
      }

      // Middle mouse button equivalents
      // Triggered by a horizontal swipe
      if (sx !== 0) {
        setMouseMiddlePressed(down ? 1 : 0);
      }

      // Right mouse button equivalents
      // Triggered by a long press (no drag)
      if (!down && !tap && sx === 0) {
        setMouseRightPressed(1);
      } else {
        setMouseRightPressed(0);
      }
    },
  });

  return (
    <>
      <Canvas
        id="canvasScene"
        gl={{ antialias: false, toneMapping: NoToneMapping }}
        linear
        ref={refCanvas}
        {...bind()}
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
        <color attach="background" args={[0x1a1528]} />
        <Camera
          aspect={windowWidth / windowHeight}
          mouseRightPressed={mouseRightPressed}
          mouseWheelProp={mouseWheelProp}
          index={index}
          citySize={citySize}
        />
        <Grid
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
        />

        {data && cityData ? (
          <Ground tileset={data?.defs.tilesets[0]} cityData={cityData} />
        ) : null}

        {data && buildingData ? (
          <Buildings
            tilesets={data?.defs.tilesets}
            buildingData={buildingData}
          />
        ) : null}
        {/* <AnimatedSprite
          src="/textures/AsepriteParseTester.aseprite"
          scale={[2, 2, 2]}
          position={[0, 2, 0]}
        /> */}

        {/* <TerrainBackground />
        <Terrain />
        <TerrainBorder /> */}
      </Canvas>
    </>
  );
};
