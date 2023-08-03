import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useAccount, useConnectors, useProvider } from "@starknet-react/core";
import { Land } from "@/components/scene/Land";
import Navbar from "@/components/UI/navbar";
import styles from "../styles/land.module.css";
import Button from "@/components/UI/button";
import Wallets from "@/components/Connect/wallets";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address } = useAccount();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { provider } = useProvider();
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";
  const [nighMode, setNightMode] = useState(false);
  const [hasWallet, setHasWallet] = useState<boolean>(true);
  const { available, connect } = useConnectors();

  useEffect(() => {
    if (!address) return;

    const STARKNET_NETWORK = {
      mainnet: "0x534e5f4d41494e",
      testnet: "0x534e5f474f45524c49",
    };
    provider.getChainId().then((chainId) => {
      if (chainId === STARKNET_NETWORK.testnet && network === "mainnet") {
        setIsWrongNetwork(true);
      } else if (
        chainId === STARKNET_NETWORK.mainnet &&
        network === "testnet"
      ) {
        setIsWrongNetwork(true);
      } else {
        setIsWrongNetwork(false);
      }
    });
  }, [provider, network, address]);

  return (
    <>
      <Navbar setNightMode={setNightMode} nightMode={nighMode} />
      {address && !isWrongNetwork ? (
        <Land address={address} nightMode={nighMode} />
      ) : (
        <>
          <div className={`h-screen flex justify-center items-center flex-col`}>
            <h2 className={`${styles.name} mb-5`}>You&apos;re not connected</h2>
            <div className="text-background ml-5 mr-5">
              <Button
                onClick={
                  available.length === 1
                    ? () => connect(available[0])
                    : () => setHasWallet(true)
                }
              >
                Connect
              </Button>
            </div>
          </div>
          <Wallets
            closeWallet={() => setHasWallet(false)}
            hasWallet={hasWallet}
          />
        </>
      )}
    </>
  );
}
