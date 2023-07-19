import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useAccount, useProvider } from "@starknet-react/core";
import { Land } from "@/components/scene/Land";
import Navbar from "@/components/scene/UI/navbar";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address } = useAccount();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const { provider } = useProvider();
  const network =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "testnet" : "mainnet";

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
      {address && !isWrongNetwork ? <Land address={address} /> : null}
    </>
  );
}
