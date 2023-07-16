import { AspectNftProps } from "@/types/types";
import { hexToDecimal } from "./feltService";
import { LandsNFTs } from "./constants";

export const checkAssetInLands = (
  asset: AspectNftProps,
  targetSet: Set<string>,
  contractAddress: string,
  key: string,
  finalNFTs: { [key: string]: boolean | number }
) => {
  if (
    hexToDecimal(asset.contract_address) === hexToDecimal(contractAddress) &&
    targetSet.has(asset.name as string)
  ) {
    (finalNFTs[`${key}Counter`] as number)++;
    targetSet.delete(asset.name as string);
    (finalNFTs.totalNFTs as number)++;
  }
};

export const checkAssetInSq = (
  asset: AspectNftProps,
  finalNFTs: { [key: string]: boolean | number }
) => {
  if (
    hexToDecimal(asset.contract_address) !==
    hexToDecimal(LandsNFTs.sq.contract_address)
  )
    return;

  const assetMap: { [key: string]: string | number } = {
    "StarkFighter Bronze Arcade": 1,
    "StarkFighter Silver Arcade": 2,
    "StarkFighter Gold Arcade": 3,
    "AVNU Astronaut": "hasAVNU",
    "JediSwap Light Saber": "hasJediSwap",
    "Zklend Artemis": "hasZkLend",
    "Starknet ID Tribe Totem": "hasSIDTotem",
    "Starknet ID Tribe Shield": "hasSIDShield",
  };

  if (assetMap[asset.name as string]) {
    if (typeof assetMap[asset.name as string] === "number") {
      if (finalNFTs.starkFighterLevel < assetMap[asset.name as string]) {
        finalNFTs.starkFighterLevel = assetMap[asset.name as string] as number;
        (finalNFTs.totalNFTs as number)++;
      }
    } else {
      finalNFTs[assetMap[asset.name as string]] = true;
      (finalNFTs.totalNFTs as number)++;
    }
  }
};
