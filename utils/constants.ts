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

export const totalNFT = 22;
// limite 15 - 25 - 40

export const LandsNFTs = {
  braavos: {
    contract_address:
      "0x00057c4b510d66eb1188a7173f31cccee47b9736d40185da8144377b896d5ff3",
    levels: {
      1: 2,
      2: 3,
      3: 5,
    },
    nft_names: [
      "Starknet Exchange Journey",
      "Starknet Mobile Journey",
      "Starknet Journey Map",
      "Starknet Onboarding Journey",
      "Starknet Journey Coin NFT",
      "Starknet Identity Journey",
    ],
  },
  argentx: {
    contract_address:
      "0x01b22f7a9d18754c994ae0ee9adb4628d414232e3ebd748c386ac286f86c3066",
    levels: {
      1: 2,
      2: 4,
      3: 6,
    },
    nft_names: [
      "Xplorer — Argent",
      "Xplorer — Starkfighter",
      "Xplorer — Jediswap",
      "Xplorer — Mintsquare",
      "Xplorer — Layerswap",
      "Xplorer — Briq",
      "Xplorer — AVNU",
      "Xplorer — Dappland",
    ],
  },
  sq: {
    contract_address:
      "0x076503062d78f4481be03c9145022d6a4a71ec0719aa07756f79a2384dc7ef16",
    nft_names: [
      "StarkFighter Bronze Arcade",
      "StarkFighter Silver Arcade",
      "StarkFighter Gold Arcade",
      "AVNU Astronaut",
      "Starknet ID Tribe Totem",
      "Starknet ID Tribe Shield",
      "Zklend Artemis",
      "JediSwap Light Saber",
    ],
  },
};

export const TILE_SIZE = 16;
export const MIN_LAND_WIDTH = 7;
export const MAX_LAND_WIDTH = 16;
export const MIN_LAND_HEIGHT = 6;
export const MAX_LAND_HEIGHT = 7;
export const ROAD_SIZE = 2;
export const TILE_EMPTY = 0;

export const pointLightsData: { [key: string]: pointLightProps } = {
  pink1: {
    intensity: 0.8,
    color: "pink",
    z: 0.6,
    distance: 50,
    decay: 4,
  },
  pink2: {
    intensity: 0.8,
    color: "pink",
    z: 0.6,
    distance: 50,
    decay: 4,
  },
  green1: {
    intensity: 3,
    color: "#8fca58",
    z: 0.8,
    distance: 20,
    decay: 5,
  },
  green2: {
    intensity: 1.7,
    color: "#48dda0",
    z: 2.6,
    distance: 30,
    decay: 4,
  },
  yellow1: {
    intensity: 0.8,
    color: "#e8c170",
    z: 0.6,
    distance: 50,
    decay: 10,
  },
  yellow2: {
    intensity: 0.8,
    color: "yellow",
    z: 0.6,
    distance: 50,
    decay: 10,
  },
  white1: {
    intensity: 1.8,
    color: "0xffffff",
    z: 1.2,
    distance: 30,
    decay: 7,
  },
  purple1: {
    intensity: 1,
    color: "#f21bb9",
    z: 1.2,
    distance: 20,
    decay: 4,
    power : 30,
  },
  orange1: {
    intensity: 2.8,
    color: "orange",
    z: 1.1,
    distance: 20,
    decay: 5,
  },
  blue1: {
    intensity: 2.8,
    color: "#2595ba",
    z: 1.2,
    distance: 20,
    decay: 4,
  },
  blue2: {
    intensity: 0.8,
    color: "blue",
    z: 0.6,
    distance: 50,
    decay: 10,
  },
  red1: {
    intensity: 2.8,
    color: "#f75c5f",
    z: 0.6,
    distance: 50,
    decay: 10,
    power : 40,
  },
  street1: {
    intensity: 2.2,
    color: "#e6b9f0",
    z: 0.4,
    distance: 100,
    decay: 15,
    power : 30,
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
