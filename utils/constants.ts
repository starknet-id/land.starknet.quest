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
