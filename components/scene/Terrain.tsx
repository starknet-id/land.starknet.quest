import React, { useMemo } from "react";
import { TextureLoader, RepeatWrapping, NearestFilter } from "three";

export const Terrain = () => {
  const textureLoader = useMemo(() => {
    const textObj = new TextureLoader().load("/textures/World_Background.png");
    textObj.repeat.set(1, 1);
    textObj.wrapS = textObj.wrapT = RepeatWrapping;
    textObj.magFilter = NearestFilter;

    return textObj;
  }, []);

  return (
    <>
      <mesh
        position={[21, 0, 9]}
        name="terrainMesh"
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry
          name="terrainGeometry"
          attach="geometry"
          args={[40, 16, 1, 1]}
        />
        <meshStandardMaterial
          attach="material"
          map={textureLoader}
          transparent={true}
          depthWrite={false}
          depthTest={true}
        />
      </mesh>
    </>
  );
};
