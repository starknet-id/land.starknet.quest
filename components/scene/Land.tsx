import { AspectApiResult, AspectNftProps } from "@/types/types";
import { decimalToHex, hexToDecimal } from "@/utils/feltService";
import React, { useEffect, useState } from "react";
import { Scene } from "./Scene";
import { LandsNFTs } from "@/utils/constants";
import { checkAssetInLands, checkAssetInSq } from "@/utils/sortNfts";

type LandProps = {
  address: string;
};

export const Land = ({ address }: LandProps) => {
  const [userNft, setUserNft] = useState<{ [key: string]: boolean | number }>();
  // on fetch et on filtre les NFTs du user

  useEffect(() => {
    if (address) {
      retrieveAssets(
        `https://${
          process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "api-testnet" : "api"
        }.aspect.co/api/v0/assets?owner_address=0x61b6c0a78f9edf13cea17b50719f3344533fadd470b8cb29c2b4318014f52d3`
        // }.aspect.co/api/v0/assets?owner_address=${decimalToHex("address")}`
      ).then((data) => {
        filterAssets(data.assets);
      });
    }
  }, [address]);

  const retrieveAssets = async (
    url: string,
    accumulatedAssets: AspectNftProps[] = []
  ): Promise<AspectApiResult> => {
    console.log("retrieving assets");
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${
          process.env.NEXT_PUBLIC_IS_TESTNET === "true"
            ? process.env.NEXT_PUBLIC_ASPECT_TESTNET
            : process.env.NEXT_PUBLIC_ASPECT_MAINNET
        }`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const assets = [...accumulatedAssets, ...data.assets];
        if (data.next_url) {
          return retrieveAssets(data.next_url, assets);
        } else {
          return {
            assets: assets,
          };
        }
      });
  };

  const filterAssets = (assets: AspectNftProps[]) => {
    console.log("assets", assets);

    let finalNFTs: { [key: string]: boolean | number } = {
      totalNFTs: 0,
      braavosCounter: 0,
      argentxCounter: 0,
      starkFighterLevel: 0,
      hasZkLend: false,
      hasAVNU: false,
      hasJediSwap: false,
      hasSIDShield: false,
      hasSIDTotem: false,
    };

    const braavosTarget = new Set(LandsNFTs.braavos.nft_names);
    const argentxTarget = new Set(LandsNFTs.argentx.nft_names);

    for (let i = 0; i < assets.length; i++) {
      const asset = assets[i];
      checkAssetInLands(
        asset,
        braavosTarget,
        LandsNFTs.braavos.contract_address,
        "braavos",
        finalNFTs
      );
      checkAssetInLands(
        asset,
        argentxTarget,
        LandsNFTs.argentx.contract_address,
        "argentx",
        finalNFTs
      );
      checkAssetInSq(asset, finalNFTs);
    }
    setUserNft(finalNFTs);
    // console.log("finalNFTs", finalNFTs);
  };

  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          zIndex: "0",
          touchAction: "none",
          overflow: "hidden",
        }}
      >
        <Scene address={address} userNft={userNft} />
      </div>
    </>
  );
};
