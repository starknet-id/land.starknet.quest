import { pointLightProps } from "@/types/types";
import { hexToDecimal } from "./feltService";

export const basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
export const bigAlphabet = "这来";
export const totalAlphabet = basicAlphabet + bigAlphabet;

export const NFTContracts = [
  hexToDecimal(
    "0x076503062d78f4481be03c9145022d6a4a71ec0719aa07756f79a2384dc7ef16"
  ), // quest NFT Contract
  hexToDecimal(
    "0x01b22f7a9d18754c994ae0ee9adb4628d414232e3ebd748c386ac286f86c3066"
  ), // xplorer NFT Contract
  hexToDecimal(
    "0x067c358ec1181fc1e19daeebae1029cb478bb71917a5659a83a361c012fe3b6b"
  ), // braavos shield NFT Contract
  hexToDecimal(
    "0x00057c4b510d66eb1188a7173f31cccee47b9736d40185da8144377b896d5ff3"
  ), // braavos journey NFT Contract
];

export const TILE_SIZE = 16;
export const MIN_LAND_WIDTH = 7;
export const MAX_LAND_WIDTH = 16;
export const MIN_LAND_HEIGHT = 6;
export const MAX_LAND_HEIGHT = 7;
export const ROAD_SIZE = 2;
export const TILE_EMPTY = 0;

export const pointLightsData: { [key: string]: pointLightProps } = {
  testlight: {
    intensity: 0.5,
    color: "0xffffff",
    z: 23.2,
  },
};

export const propsOffset: {
  [key: string]: { [key: string]: { x: number; y: number } };
} = {
  Props_StreetLight: {
    topLeft: { x: 0, y: 0 },
    topRight: { x: -0.2, y: 0 },
    bottomLeft: { x: 0, y: -0.2 },
    bottomRight: { x: -0.1, y: -0.2 },
  },
};

export const buildingsOrdered = {
  5: [
    [2, 3],
    // [5]
  ],
  6: [
    // [2, 2, 2],
    [2, 4],
    // [3, 3],
    [6],
  ],
  7: [
    [2, 2, 3],
    [2, 5],
    [3, 4],
  ],
  8: [
    // [2, 2, 2, 2],
    [2, 2, 4],
    [2, 3, 3],
    [2, 6],
    [3, 5],
    // [4, 4],
  ],
  9: [
    [2, 2, 2, 3],
    [2, 2, 5],
    [2, 3, 4],
    // [3, 3, 3],
    [3, 6],
    [4, 5],
  ],
  10: [
    // [2, 2, 2, 2, 2],
    [2, 2, 2, 4],
    [2, 2, 3, 3],
    [2, 2, 6],
    [2, 3, 5],
    [2, 4, 4],
    [3, 3, 4],
    [4, 6],
    // [5, 5],
  ],
  11: [
    // [2, 2, 2, 2, 3],
    [2, 2, 2, 5],
    [2, 2, 3, 4],
    [2, 3, 3, 3],
    [2, 3, 6],
    [2, 4, 5],
    [3, 3, 5],
    [3, 4, 4],
    [5, 6],
  ],
  12: [
    // [2, 2, 2, 2, 2, 2],
    // [2, 2, 2, 2, 4],
    // [2, 2, 2, 3, 3],
    [2, 2, 3, 5],
    [2, 2, 4, 4],
    [2, 3, 3, 4],
    [2, 4, 6],
    [2, 5, 5],
    [3, 3, 6],
    // [3, 3, 3, 3],
    [3, 4, 5],
    // [4, 4, 4],
    // [6, 6]
  ],
  13: [
    // [2, 2, 2, 2, 2, 3],
    // [2, 2, 2, 2, 5],
    // [2, 2, 2, 3, 4],
    [2, 2, 3, 3, 3],
    [2, 2, 3, 6],
    [2, 2, 4, 5],
    [2, 3, 3, 5],
    [2, 3, 4, 4],
    [2, 5, 6],
    [3, 3, 3, 4],
    [3, 4, 6],
    [3, 5, 5],
    [4, 4, 5],
  ],
  14: [
    // [2, 2, 2, 2, 2, 2, 2],
    // [2, 2, 2, 2, 2, 4],
    // [2, 2, 2, 2, 3, 3],
    // [2, 2, 2, 2, 6]
    [2, 2, 2, 3, 5],
    [2, 2, 2, 4, 4],
    [2, 2, 3, 3, 4],
    [2, 2, 4, 6],
    [2, 2, 5, 5],
    // [2, 3, 3, 3, 3],
    [2, 3, 3, 6],
    [2, 3, 4, 5],
    [2, 4, 4, 4],
    [3, 3, 3, 5],
    [3, 3, 4, 4],
    [4, 5, 5],
    [3, 5, 6],
    [4, 4, 6],
  ],
};
