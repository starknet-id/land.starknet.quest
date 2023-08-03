import { StarkscanNftProps } from "@/types/types";
import { hexToDecimal } from "./feltService";
import { NFTCounters } from "@/types/nft";
import { LandsNFTs, NFTKeys, WalletKeys } from "@/constants/nft";

export const checkAssetInLands = (
  asset: StarkscanNftProps,
  targetSet: Set<string>,
  contractAddress: string,
  key: string,
  finalNFTCounters: NFTCounters
) => {
  if (
    hexToDecimal(asset.contract_address) === hexToDecimal(contractAddress) &&
    targetSet.has(asset.name as string)
  ) {
    if (key === WalletKeys.Braavos) {
      finalNFTCounters.braavosCounter++;
    } else if (key === WalletKeys.Argentx) {
      finalNFTCounters.argentxCounter++;
    }
    targetSet.delete(asset.name as string);
    finalNFTCounters.totalNFTs++;
  }
};

export const checkAssetInSq = (
  asset: StarkscanNftProps,
  finalNFTCounters: NFTCounters,
  finalNFTFlags: boolean[]
) => {
  if (
    hexToDecimal(asset.contract_address) !==
    hexToDecimal(LandsNFTs.sq.contract_address)
  )
    return;

  const assetMap: { [key: string]: number } = {
    "StarkFighter Bronze Arcade": 1,
    "StarkFighter Silver Arcade": 2,
    "StarkFighter Gold Arcade": 3,
    "AVNU Astronaut": NFTKeys.AVNU,
    "JediSwap Light Saber": NFTKeys.JediSwap,
    "Zklend Artemis": NFTKeys.Zklend,
    "Starknet ID Tribe Totem": NFTKeys.SIDTotem,
    "Starknet ID Tribe Shield": NFTKeys.SIDShield,
    "Sithswap Helmet": NFTKeys.SithSwap,
  };

  const assetKey = assetMap[asset.name as string];
  if (assetKey !== undefined) {
    if (asset.name?.startsWith("StarkFighter")) {
      if (finalNFTCounters.starkFighterLevel < assetKey) {
        finalNFTCounters.starkFighterLevel = assetKey;
        finalNFTCounters.totalNFTs++;
      }
    } else {
      if (assetKey in NFTKeys) {
        finalNFTFlags[assetKey] = true;
        finalNFTCounters.totalNFTs++;
      }
    }
    // if (typeof assetKey === "number") {
    //   if (asset.name?.startsWith("StarkFighter")) {
    //     if (finalNFTCounters.starkFighterLevel < assetKey) {
    //       finalNFTCounters.starkFighterLevel = assetKey;
    //       finalNFTCounters.totalNFTs++;
    //     }
    //   }
    // } else {
    //   if (assetKey in NFTKeys) {
    //     finalNFTFlags[assetKey] = true;
    //     finalNFTCounters.totalNFTs++;
    //   }
    // }
  }
};
