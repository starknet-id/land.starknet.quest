import React, {
  useLayoutEffect,
  useRef,
  useState,
  FunctionComponent,
} from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { Vector2 } from "three";

type CameraProps = {
  aspect: number;
  mouseRightPressed?: number;
  mouseWheelProp?: number;
  index: number;
  citySize: number;
  isFirstTouch: boolean;
};

export const Camera: FunctionComponent<CameraProps> = ({
  aspect,
  mouseRightPressed,
  index,
  citySize,
  isFirstTouch,
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const set = useThree(({ set }) => set);
  const size = useThree(({ size }) => size);
  const [tempMousePos, setTempMousePos] = useState(new Vector2(0, 0));
  const [cameraPositionX, setCameraPositionX] = useState(Math.floor(25));
  const [cameraPositionY, setCameraPositionY] = useState(
    Math.floor(citySize / 2)
  );
  const [cameraPositionZ, setCameraPositionZ] = useState(
    Math.floor(citySize / 3)
  );

  useFrame(({ mouse }) => {
    if (cameraRef.current != null) {
      setCameraPositionY(15 * index);
      if (mouseRightPressed == 1) {
        const posX = cameraPositionX;
        const posZ = cameraPositionZ;

        const mouseMove = new Vector2(0, 0);
        let difX = isFirstTouch ? 0 : (tempMousePos.x - mouse.x) * 100;
        let difY = isFirstTouch ? 0 : (tempMousePos.y - mouse.y) * 100;

        if (difX < 0) difX = difX * -1;
        if (difY < 0) difY = difY * -1;

        if (tempMousePos.x < mouse.x) {
          if (cameraPositionX > 0) {
            mouseMove.x = 0.1 * difX;
            setCameraPositionX(cameraPositionX - mouseMove.x);
          }
        } else if (tempMousePos.x > mouse.x) {
          if (cameraPositionX < citySize) {
            mouseMove.x = 0.1 * difX;
            setCameraPositionX(cameraPositionX + mouseMove.x);
          }
        } else if (tempMousePos.x == mouse.x) {
          mouseMove.x = 0;
        }
        if (tempMousePos.y < mouse.y) {
          if (cameraPositionZ < citySize) {
            mouseMove.y = 0.1 * difY;
            setCameraPositionZ(cameraPositionZ + mouseMove.y);
          }
        } else if (tempMousePos.y > mouse.y) {
          if (cameraPositionZ > 0) {
            mouseMove.y = 0.1 * difY;
            setCameraPositionZ(cameraPositionZ - mouseMove.y);
          }
        } else if (tempMousePos.y == mouse.y) {
          mouseMove.y = 0;
        }
      }
      setTempMousePos(new Vector2(mouse.x, mouse.y));

      cameraRef.current.aspect = size.width / size.height;
      cameraRef.current.position.set(
        cameraPositionX,
        cameraPositionY,
        cameraPositionZ
      );
      cameraRef.current.updateProjectionMatrix();
    } // END
  });

  useLayoutEffect(() => {
    set({ camera: cameraRef.current as THREE.PerspectiveCamera });
  }, []);

  return (
    <>
      <PerspectiveCamera
        manual
        ref={cameraRef}
        fov={5}
        near={1}
        far={1000}
        rotation={[-Math.PI * 0.5, 0, 0]}
        aspect={aspect}
      />
    </>
  );
};
