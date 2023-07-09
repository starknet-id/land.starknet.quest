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

export const NFTAvailable = [
  "NFT_FrensLand_3x2_H4",
  "NFT_StarkCoin_3x2_H2",
  "NFT_TotemID_2X1_H3",
  "NFT_ArgentMain_4x3_H5",
  "NFT_ArgentMain_4x2_H7",
  "NFT_StarkFighter_4x2_H3",
  "NFT_BriqMain_4x3_H3",
  "NFT_JediSwap_4x3_H7",
  "NFT_BraavosMobile_2x2_H3",
  "NFT_BraavosOnboard_3x1_H3",
  "NFT_StarkID_6x4_H6",
  "NFT_MySwap_3x2_H5_CornerLeft",
];

export const buildingsOrdered = {
  // todo: add 5 and 6
  7: [
    [2, 2, 3],
    [2, 5],
    [3, 4],
  ],
  8: [
    // [2, 2, 2, 2],
    [2, 2, 4],
    [2, 3, 3],
    [3, 5],
    [4, 4],
  ],
  9: [
    [2, 2, 2, 3],
    [2, 2, 5],
    [2, 3, 4],
    // [3, 3, 3],
    [4, 5],
  ],
  10: [
    // [2, 2, 2, 2, 2],
    [2, 2, 2, 4],
    [2, 2, 3, 3],
    [2, 3, 5],
    [2, 4, 4],
    [3, 3, 4],
    // [5, 5],
  ],
  11: [
    [2, 2, 2, 2, 3],
    [2, 2, 2, 5],
    [2, 2, 3, 4],
    [2, 3, 3, 3],
    [2, 4, 5],
    [3, 3, 5],
    [3, 4, 4],
  ],
  12: [
    // [2, 2, 2, 2, 2, 2],
    // [2, 2, 2, 2, 4],
    // [2, 2, 2, 3, 3],
    [2, 2, 3, 5],
    [2, 2, 4, 4],
    [2, 3, 3, 4],
    [2, 5, 5],
    // [3, 3, 3, 3],
    [3, 4, 5],
    // [4, 4, 4],
  ],
  13: [
    // [2, 2, 2, 2, 2, 3],
    // [2, 2, 2, 2, 5],
    // [2, 2, 2, 3, 4],
    [2, 2, 3, 3, 3],
    [2, 2, 4, 5],
    [2, 3, 3, 5],
    [2, 3, 4, 4],
    [3, 3, 3, 4],
    [3, 5, 5],
    [4, 4, 5],
  ],
  14: [
    // [2, 2, 2, 2, 2, 2, 2],
    // [2, 2, 2, 2, 2, 4],
    // [2, 2, 2, 2, 3, 3],
    [2, 2, 2, 3, 5],
    [2, 2, 2, 4, 4],
    [2, 2, 3, 3, 4],
    [2, 2, 5, 5],
    [2, 3, 3, 3, 3],
    [2, 3, 4, 5],
    [2, 4, 4, 4],
    [3, 3, 3, 5],
    [3, 3, 4, 4],
    [4, 5, 5],
  ],
  // todo: remove 15 and 16 as they should never happen because of sidewalks
  15: [
    // [2, 2, 2, 2, 2, 2, 3],
    // [2, 2, 2, 2, 2, 5],
    // [2, 2, 2, 2, 3, 4],
    [2, 2, 2, 3, 3, 3],
    [2, 2, 2, 4, 5],
    [2, 2, 3, 3, 5],
    [2, 2, 3, 4, 4],
    [2, 3, 3, 3, 4],
    [2, 3, 5, 5],
    [2, 4, 4, 5],
    // [3, 3, 3, 3, 3],
    [3, 3, 4, 5],
    [3, 4, 4, 4],
    // [5, 5, 5],
  ],
  16: [
    // [2, 2, 2, 2, 2, 2, 2, 2],
    // [2, 2, 2, 2, 2, 2, 4],
    // [2, 2, 2, 2, 2, 3, 3],
    [2, 2, 2, 2, 3, 5],
    [2, 2, 2, 2, 4, 4],
    [2, 2, 2, 3, 3, 4],
    [2, 2, 2, 5, 5],
    [2, 2, 3, 3, 3, 3],
    [2, 2, 3, 4, 5],
    [2, 2, 4, 4, 4],
    [2, 3, 3, 3, 5],
    [2, 3, 3, 4, 4],
    [2, 4, 5, 5],
    [3, 3, 3, 3, 4],
    [3, 3, 5, 5],
    [3, 4, 4, 5],
    // [4, 4, 4, 4],
  ],
};
