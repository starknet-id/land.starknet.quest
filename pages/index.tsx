import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useAccount, useConnectors, useProvider } from "@starknet-react/core";
import { useDisplayName, useDomainFromAddress } from "@/utils/namingService";
import Button from "@/components/scene/UI/Button";
import Wallets from "@/components/scene/Connect/wallets";
import styles from "../styles/home.module.css";
import PixelModal from "@/components/scene/UI/PixelModal";
import { Land } from "@/components/scene/Land";
import { hexToDecimal } from "@/utils/feltService";
import Navbar from "@/components/scene/UI/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // const [hasWallet, setHasWallet] = useState<boolean>(true);
  const { address } = useAccount();
  // const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  // const { available, connect, disconnect } = useConnectors();
  const { provider } = useProvider();
  // const domain = useDomainFromAddress(address ?? "").domain;
  // const domainOrAddressMinified = useDisplayName(address ?? "");
  // const addressOrDomain =
  //   domain && domain.endsWith(".stark") ? domain : address;
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";

  // function disconnectByClick(): void {
  //   disconnect();
  //   setIsConnected(false);
  //   setIsWrongNetwork(false);
  // }

  // useEffect(() => {
  //   address ? setIsConnected(true) : setIsConnected(false);
  // }, [address]);

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
      <Navbar />

      {/* {!address ? (
        <>
          <div className={styles.screen}>
            <div className={styles.container}>
              <PixelModal width={0}>
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
                      </div>
                    ) : (
                      "connect"
                    )}
                  </Button>
                </>
              </PixelModal>
            </div>
          </div>
          <Wallets
            closeWallet={() => setHasWallet(false)}
            hasWallet={Boolean(hasWallet && !isWrongNetwork)}
          />
        </>
      ) : ( */}
      {address && !isWrongNetwork ? (
        <Land address={hexToDecimal(address)} />
      ) : null}
    </>
  );
}
