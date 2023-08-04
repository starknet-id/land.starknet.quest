import { CityObjectsProps, TileData } from "@/types/types";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { InstancedMesh, Mesh, Texture } from "three";

type IElem = {
  tileset: any;
  pos?: { posX: number; posY: number };
  textureLoader: Texture;
  propData: CityObjectsProps[];
  entity?: any;
  index: number;
  tileData: TileData;
};

const PropsItem = memo<IElem>(
  ({ tileset, pos, textureLoader, propData, entity, index, tileData }): any => {
    const [localTexture, setLocalTexture] = useState<any>(null);
    const lightMeshRef = useRef<InstancedMesh>(null);
    const tempObject = new Mesh();

    const elemTexture = useMemo(() => {
      if (tileset && textureLoader) {
        const localT = textureLoader.clone();
        localT.needsUpdate = true;
        localT.offset.set(tileData.textureOffset.x, tileData.textureOffset.y);
        localT.repeat.set(tileData.textureRepeat.x, tileData.textureRepeat.y);
        return localT;
      }
    }, [textureLoader, tileset]);

    useEffect(() => {
      if (lightMeshRef == null || !lightMeshRef.current) return;

      let i = 0;
      propData.map((prop: CityObjectsProps) => {
        const id = i++;
        let offset = { x: 0, y: 0, z: 0 };
        if (prop.offset)
          offset = {
            x: prop?.offset.x ?? 0,
            y: prop?.offset.y ?? 0,
            z: prop?.offset.z ?? 0,
          };
        tempObject.position.set(
          prop.posX + offset.x + 1,
          tileData.z + offset.z,
          prop.posY + offset.y - 2
        );
        tempObject.rotation.set(-Math.PI * 0.5, 0, 0);
        tempObject.updateMatrix();
        if (lightMeshRef.current)
          lightMeshRef.current.setMatrixAt(id, tempObject.matrix);
      });
      lightMeshRef.current.instanceMatrix.needsUpdate = true;
    }, [propData]);

    return (
      <instancedMesh
        ref={lightMeshRef}
        args={[null as any, null as any, propData.length]}
      >
        <planeGeometry
          name={"props_geom"}
          attach="geometry"
          args={[tileData.plane.w, tileData.plane.h, 1, 1]}
        ></planeGeometry>
        <meshBasicMaterial
          attach="material"
          map={localTexture}
          name={
            `${tileData.entity.tileRect.tilesetUid}_props`.toString() + "_mat"
          }
          transparent={true}
          depthWrite={false}
          depthTest={true}
        />
      </instancedMesh>
    );
  }
);

PropsItem.displayName = "PropsItem";
export default PropsItem;
