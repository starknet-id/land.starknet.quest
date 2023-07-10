import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { getGridPositionFromTileset } from "@/utils/def";
import { useAccount, useConnectors, useStarknet } from "@starknet-react/core";
import { useDisplayName, useDomainFromAddress } from "@/utils/namingService";
import Button from "@/components/scene/UI/Button";
import Wallets from "@/components/scene/Connect/wallets";
import styles from "../styles/home.module.css";
import PixelModal from "@/components/scene/UI/PixelModal";
import { Scene } from "@/components/scene/Scene";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState<any>(null);
  const [landTilesets, setLandTilesets] = useState<any>(null);

  const [hasWallet, setHasWallet] = useState<boolean>(true);
  const { address } = useAccount();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { available, connect, disconnect } = useConnectors();
  const { library } = useStarknet();
  const domain = useDomainFromAddress(address ?? "").domain;
  const domainOrAddressMinified = useDisplayName(address ?? "");
  const addressOrDomain =
    domain && domain.endsWith(".stark") ? domain : address;
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";

  function disconnectByClick(): void {
    disconnect();
    setIsConnected(false);
    setIsWrongNetwork(false);
  }

  useEffect(() => {
    address ? setIsConnected(true) : setIsConnected(false);
  }, [address]);

  useEffect(() => {
    if (!isConnected) return;

    const STARKNET_NETWORK = {
      mainnet: "0x534e5f4d41494e",
      testnet: "0x534e5f474f45524c49",
    };

    if (library.chainId === STARKNET_NETWORK.testnet && network === "mainnet") {
      setIsWrongNetwork(true);
    } else if (
      library.chainId === STARKNET_NETWORK.mainnet &&
      network === "testnet"
    ) {
      setIsWrongNetwork(true);
    } else {
      setIsWrongNetwork(false);
    }
  }, [library, network, isConnected]);

  useEffect(() => {
    fetch("/data/SIDCity_Base_V3.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (data) {
      const landTilesets = getGridPositionFromTileset(data.defs.tilesets);
      console.log("landTilesets", landTilesets);
      setLandTilesets(landTilesets);
    }
  }, [data]);

  return !isConnected ? (
    <>
      <div className={styles.screen}>
        <div className={styles.container}>
          <PixelModal
            children={
              <>
                <div className="mb-5">
                  Connect with a Starknet wallet to start exploring your land.
                </div>
                <Button
                  onClick={
                    isConnected
                      ? () => disconnectByClick()
                      : available.length === 1
                      ? () => connect(available[0])
                      : () => setHasWallet(true)
                  }
                >
                  {isConnected ? (
                    <div className="flex justify-center items-center">
                      <div>{domainOrAddressMinified}</div>
                      {/* <LogoutIcon className="ml-3" /> */}
                    </div>
                  ) : (
                    "connect"
                  )}
                </Button>
              </>
            }
            width={0}
          />
        </div>
      </div>
      <Wallets
        closeWallet={() => setHasWallet(false)}
        hasWallet={Boolean(hasWallet && !isWrongNetwork)}
      />
    </>
  ) : (
    <div style={{ height: "100vh", width: "100vw", zIndex: "0" }}>
      <Scene address={address as string} />
    </div>
  );
}
