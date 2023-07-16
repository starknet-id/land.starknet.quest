import { useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useState } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter } from "three";

export const TerrainBackground = () => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [spriteData, setSpriteData] = useState<any>();
  const posX = [-20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80];
  const posY = [-10, 0, 10, 20, 30, 40, 50, 60, 70, 80];

  useEffect(() => {
    fetch("/data/SID_Background_SpaceLoop.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((jsonData) => {
        setSpriteData(jsonData);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const frames = useMemo(() => {
    if (spriteData) return Object.values(spriteData.frames) as any;
  }, [spriteData]);

  const textureLoader = useMemo(() => {
    const textObj = new TextureLoader().load(
      "textures/background/SID_Background_SpaceLoop_old.png"
    );
    textObj.wrapS = RepeatWrapping;
    textObj.wrapT = RepeatWrapping;
    textObj.magFilter = NearestFilter;
    return textObj;
  }, []);

  useEffect(() => {
    if (frames) {
      const interval = setInterval(() => {
        setCurrentFrame((currentFrame + 1) % frames.length);
      }, frames[0].duration);
      return () => clearInterval(interval);
    }
  }, [currentFrame, frames]);

  useFrame(() => {
    if (frames) {
      const { frame } = frames[currentFrame];
      textureLoader.offset.set(
        frame.x / spriteData.meta.size.w,
        1 - frame.y / spriteData.meta.size.h - frame.h / spriteData.meta.size.h
      );
      textureLoader.repeat.set(
        frame.w / spriteData.meta.size.w,
        frame.h / spriteData.meta.size.h
      );
      textureLoader.needsUpdate = true;
    }
  });

  return posX.map((x, i) => {
    return posY.map((y, j) => {
      return (
        <>
          <mesh
            position={[x, -0.2, y]}
            name={"terrainBackgroundGeometry_" + i + j}
            rotation={[-Math.PI * 0.5, 0, 0]}
          >
            <planeGeometry
              name={"terrainGeometry_" + i + j}
              attach="geometry"
              args={[10, 10, 1, 1]}
            />
            <meshBasicMaterial
              attach="material"
              map={textureLoader}
              transparent={true}
              depthWrite={false}
              depthTest={true}
            />
          </mesh>
        </>
      );
    });
  });
};
