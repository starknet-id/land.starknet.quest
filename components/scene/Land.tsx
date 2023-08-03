import { StarkscanApiResult, StarkscanNftProps } from "@/types/types";
import React, { useContext, useEffect, useState } from "react";
import { Scene } from "./Scene";
import { LandsNFTs } from "@/utils/constants";
import { checkAssetInLands, checkAssetInSq } from "@/utils/sortNfts";
import { hexToDecimal } from "@/utils/feltService";
import { StarknetIdJsContext } from "@/context/StarknetIdJsProvider";
import styles from "../../styles/land.module.css";
import Button from "../UI/button";

type LandProps = {
  address: string;
  nightMode: boolean;
  isOwner: boolean;
};

export const Land = ({ address, nightMode, isOwner }: LandProps) => {
  const [hasNFTs, setHasNFTs] = useState(false);
  const [userNft, setUserNft] = useState<{
    [key: string]: boolean | number;
  }>();

  useEffect(() => {
    if (address) {
      retrieveAssets(
        `https://${
          process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "api-testnet" : "api"
        }.starkscan.co/api/v0/nfts?owner_address=${address}`
      ).then((data) => {
        filterAssets(data.data);
      });
    }
  }, [address]);

  const retrieveAssets = async (
    url: string,
    accumulatedAssets: StarkscanNftProps[] = []
  ): Promise<StarkscanApiResult> => {
    return fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": `${process.env.NEXT_PUBLIC_STARKSCAN_MAINNET}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        const assets = [...accumulatedAssets, ...data.data];
        if (data.next_url) {
          return retrieveAssets(data.next_url, assets);
        } else {
          return {
            data: assets,
          };
        }
      });
  };

  const filterAssets = (assets: StarkscanNftProps[]) => {
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
    if ((finalNFTs.totalNFTs as number) > 0) setHasNFTs(true);
    else setHasNFTs(false);
    console.log("finalNFTs", finalNFTs);
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
        {userNft && hasNFTs ? (
          <Scene address={address} userNft={userNft} nightMode={nightMode} />
        ) : (
          <div className={`h-screen flex justify-center items-center flex-col`}>
            <h2 className={`${styles.notFound} ${styles.name} mb-5`}>
              {isOwner ? "You have" : "User has"} not fulfilled any quest yet
            </h2>
            {isOwner ? (
              <div className="text-background ml-5 mr-5">
                <Button onClick={() => window.open("https://starknet.quest")}>
                  Begin
                </Button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};
