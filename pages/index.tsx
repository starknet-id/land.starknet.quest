import { Inter } from "next/font/google";
import { useContext, useEffect, useState } from "react";
import { useAccount, useConnectors, useProvider } from "@starknet-react/core";
import { Land } from "@/components/scene/Land";
import Navbar from "@/components/UI/navbar";
import styles from "../styles/land.module.css";
import Button from "@/components/UI/button";
import Wallets from "@/components/Connect/wallets";
import { StarknetIdJsContext } from "@/context/StarknetIdJsProvider";
import { constants } from "starknet";
import { hexToDecimal } from "@/utils/feltService";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address } = useAccount();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { provider } = useProvider();
  const { available, connect } = useConnectors();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";
  const [nighMode, setNightMode] = useState(false);
  const [hasWallet, setHasWallet] = useState<boolean>(true);
  const [hasName, setHasName] = useState(false);

  useEffect(() => {
    if (!address) return;

    provider.getChainId().then((chainId) => {
      const isWrongNetwork =
        (chainId === constants.StarknetChainId.SN_GOERLI &&
          network === "mainnet") ||
        (chainId === constants.StarknetChainId.SN_MAIN &&
          network === "testnet");
      setIsWrongNetwork(isWrongNetwork);
    });
  }, [provider, network, address]);

  useEffect(() => {
    if (address) {
      // check that user owns a domain
      starknetIdNavigator
        ?.getStarkName(hexToDecimal(address))
        .then((name) => {
          if (name) setHasName(true);
          else setHasName(false);
        })
        .catch((e) => {
          setHasName(false);
        });
    }
  }, [address]);

  return (
    <>
      <Navbar setNightMode={setNightMode} nightMode={nighMode} />
      {address && !isWrongNetwork ? (
        hasName ? (
          <Land address={address} nightMode={nighMode} isOwner={true} />
        ) : (
          <div className={`h-screen flex justify-center items-center flex-col`}>
            <h2 className={`${styles.notFound} ${styles.name} mb-5`}>
              You don&apos;t own a .stark domain
            </h2>
            <div className="text-background ml-5 mr-5">
              <Button onClick={() => window.open("https://app.starknet.id")}>
                Get yours now
              </Button>
            </div>
          </div>
        )
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
