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

export const LandsNFTs = {
  braavos: {
    contract_address:
      "0x00057c4b510d66eb1188a7173f31cccee47b9736d40185da8144377b896d5ff3",
    levels: {
      2: ["NFT_BraavosMain_4x2_H5_1"],
      3: ["NFT_BraavosMain_4x2_H5_2"],
      4: ["NFT_BraavosMain_4x2_H6_3"],
      5: ["NFT_BraavosMain_4x2_H6_3", "NFT_BraavosOnboard_3x1_H3"],
      6: [
        "NFT_BraavosMain_4x2_H6_3",
        "NFT_BraavosOnboard_3x1_H3",
        "NFT_BraavosMobile_2x2_H3",
      ],
    },
    identifier: "NFT_BraavosMobile_2x2_H3",
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
      2: ["NFT_ArgentMain_4x3_H3_1"],
      3: ["NFT_ArgentMain_4x3_H4_2"],
      4: ["NFT_ArgentMain_4x3_H5_3"],
      5: ["NFT_ArgentMain_4x3_H5_3"],
      6: ["NFT_ArgentMain_4x3_H5_3", "NFT_ArgentExplorer_1_3x2_H4"],
      7: ["NFT_ArgentMain_4x3_H5_3", "NFT_ArgentExplorer_2_3x1_H3"],
      8: [
        "NFT_ArgentMain_4x3_H5_3",
        "NFT_ArgentExplorer_2_3x1_H3",
        "NFT_DappLand_3x2_H3",
      ],
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
    levels: {
      starknetID: "NFT_StarkID_6x4_H6",
      hasAVNU: "NFT_Avnu_3x2_H3",
      hasJediSwap: "NFT_JediSwap_4x3_H7",
      hasSIDShield: "",
      hasSIDTotem: "NFT_TotemID_2X1_H3",
      hasZkLend: "NFT_Zklend_3X2_H3",
      starkFighterLevel: "NFT_StarkFighter_4x2_H3_",
    },
  },
  other: {
    nfts: [
      "NFT_SushiRest_4x2_H2",
      "NFT_StarkCoin_3x2_H2",
      "NFT_PepperBar_4x3_H2",
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

export const propsOffset: {
  [key: string]: {
    [key: string]: { x: number; y: number; z: number };
  };
} = {
  Props_StreetLight: {
    topLeft: { x: 0.5, y: -0.3, z: 0 },
    topRight: { x: 0.4, y: -0.3, z: 0 },
    bottomLeft: { x: 0.5, y: -0.3, z: 0 },
    bottomRight: { x: 0.4, y: -0.3, z: 0 },
  },
  Props_Tree_1x1: {
    top: { x: 0.6, y: -0.2, z: 0 },
    left: { x: 0.6, y: -0.2, z: 0 },
    bottom: { x: 0.6, y: -0.4, z: 0 },
    right: { x: 0.5, y: -0.2, z: 0 },
  },
  Props_SewerPlate: {
    top: { x: 0.6, y: 0.5, z: 0 },
    left: { x: 0.6, y: 0.5, z: 0 },
    bottom: { x: 0.5, y: 0.4, z: 0 },
    right: { x: 0.5, y: 0.4, z: 0 },
  },
  Props_FireHydrant: {
    top: { x: 0.5, y: 0.5, z: 0 },
    left: { x: 0.5, y: 0.4, z: 0 },
    bottom: { x: 0.5, y: 0.3, z: 0 },
    right: { x: 0.5, y: 0.3, z: 0 },
  },
  Props_BenchGrey: {
    bottom: { x: 0.5, y: -0.3, z: 0 },
  },
};

export const buildingsOrdered = {
  5: [[2, 3]],
  6: [[2, 4], [6]],
  7: [
    [2, 2, 3],
    [2, 5],
    [3, 4],
  ],
  8: [
    [2, 2, 4],
    [2, 3, 3],
    [2, 6],
    [3, 5],
  ],
  9: [
    [2, 2, 2, 3],
    [2, 2, 5],
    [2, 3, 4],
    [3, 6],
    [4, 5],
  ],
  10: [
    [2, 2, 2, 4],
    [2, 2, 3, 3],
    [2, 2, 6],
    [2, 3, 5],
    [2, 4, 4],
    [3, 3, 4],
    [4, 6],
  ],
  11: [
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
    [2, 2, 3, 5],
    [2, 2, 4, 4],
    [2, 3, 3, 4],
    [2, 4, 6],
    [2, 5, 5],
    [3, 3, 6],
    [3, 4, 5],
  ],
  13: [
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
    [2, 2, 2, 3, 5],
    [2, 2, 2, 4, 4],
    [2, 2, 3, 3, 4],
    [2, 2, 4, 6],
    [2, 2, 5, 5],
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

export enum PropsTypes {
  LIGHT = 0,
  TREE = 1,
  SEWER_PLATE = 2,
  FIRE_HYDRANT = 3,
  BENCH = 4,
}

export const PropsTypesNames = {
  [PropsTypes.LIGHT]: "Props_StreetLight",
  [PropsTypes.TREE]: "Props_Tree_1x1",
  [PropsTypes.SEWER_PLATE]: "Props_SewerPlate",
  [PropsTypes.FIRE_HYDRANT]: "Props_FireHydrant",
  [PropsTypes.BENCH]: "Props_BenchGrey",
};

export enum tileTypes {
  PROPS = 0,
  LIGHTS = 1,
}

export enum LightTypes {
  BLUE_1 = 0,
  PINK_1 = 1,
  YELLOW_1 = 2,
  GREEN_1 = 3,
  WHITE_1 = 4,
  ORANGE_1 = 5,
  PURPLE_1 = 6,
  GREEN_2 = 7,
  RED_1 = 8,
}

export const LightsTypesNames = {
  [LightTypes.BLUE_1]: "Light_Blue1_Small",
  [LightTypes.PINK_1]: "Light_Pink1_Small",
  [LightTypes.YELLOW_1]: "Light_Yellow1_Small",
  [LightTypes.GREEN_1]: "Light_Green1_Small",
  [LightTypes.WHITE_1]: "Light_White1_Small",
  [LightTypes.ORANGE_1]: "Light_Orange1_Small",
  [LightTypes.PURPLE_1]: "Light_Purple1_Small",
  [LightTypes.GREEN_2]: "Light_Green1_Small",
  [LightTypes.RED_1]: "Light_Red1_Small",
};

export const pointLightsData: { [key: string]: pointLightProps } = {
  pink1: {
    intensity: 0.8,
    color: "pink",
    z: 0.6,
    distance: 50,
    decay: 4,
    type: LightTypes.PINK_1,
  },
  pink2: {
    intensity: 0.8,
    color: "pink",
    z: 0.6,
    distance: 50,
    decay: 4,
    type: LightTypes.PINK_1,
  },
  green1: {
    intensity: 3,
    color: "#8fca58",
    z: 0.8,
    distance: 20,
    decay: 5,
    type: LightTypes.GREEN_1,
  },
  green2: {
    intensity: 1.7,
    color: "#48dda0",
    z: 2.6,
    distance: 30,
    decay: 4,
    type: LightTypes.GREEN_2,
  },
  yellow1: {
    intensity: 0.8,
    color: "#e8c170",
    z: 0.6,
    distance: 50,
    decay: 10,
    type: LightTypes.YELLOW_1,
  },
  yellow2: {
    intensity: 0.8,
    color: "yellow",
    z: 0.6,
    distance: 50,
    decay: 10,
    type: LightTypes.YELLOW_1,
  },
  white1: {
    intensity: 1.8,
    color: "#ffffff",
    z: 1.2,
    distance: 30,
    decay: 7,
    type: LightTypes.WHITE_1,
  },
  purple1: {
    intensity: 1,
    color: "#f21bb9",
    z: 1.2,
    distance: 20,
    decay: 4,
    power: 30,
    type: LightTypes.PURPLE_1,
  },
  purple3: {
    intensity: 1,
    color: "#f21bb9",
    z: 1.2,
    distance: 20,
    decay: 4,
    power: 30,
    type: LightTypes.PURPLE_1,
  },
  orange1: {
    intensity: 2.8,
    color: "orange",
    z: 1.1,
    distance: 20,
    decay: 5,
    type: LightTypes.ORANGE_1,
  },
  blue1: {
    intensity: 2.8,
    color: "#2595ba",
    z: 1.2,
    distance: 20,
    decay: 4,
    type: LightTypes.BLUE_1,
  },
  blue2: {
    intensity: 0.8,
    color: "blue",
    z: 0.6,
    distance: 50,
    decay: 10,
    type: LightTypes.BLUE_1,
  },
  red1: {
    intensity: 2.8,
    color: "#f75c5f",
    z: 0.6,
    distance: 50,
    decay: 10,
    power: 40,
    type: LightTypes.RED_1,
  },
  street1: {
    intensity: 2.2,
    color: "#e6b9f0",
    z: 0.4,
    distance: 100,
    decay: 15,
    power: 30,
    type: LightTypes.PURPLE_1,
  },
};
