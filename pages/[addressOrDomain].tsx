import { Scene } from "@/components/scene/Scene";
import { StarknetIdJsContext } from "@/context/StarknetIdJsProvider";
import { AspectApiResult, AspectNftProps, Identity } from "@/types/types";
import { NFTContracts } from "@/utils/constants";
import { getGridPositionFromTileset } from "@/utils/def";
import { decimalToHex, hexToDecimal } from "@/utils/feltService";
import { getIdentityData } from "@/utils/identity";
import { isHexString, minifyAddress } from "@/utils/stringService";
import { useAccount } from "@starknet-react/core";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const AddressOrDomain: NextPage = () => {
  const router = useRouter();
  const { addressOrDomain } = router.query;
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const { address } = useAccount();

  const [notFound, setNotFound] = useState(false);
  const [identity, setIdentity] = useState<Identity>();
  const [isOwner, setIsOwner] = useState(false);
  const [initProfile, setInitProfile] = useState(false);
  const [userNft, setUserNft] = useState<AspectNftProps[]>([]);

  // Fetch Aspect API and filter by contract Addresses
  useEffect(() => {
    if (
      typeof addressOrDomain === "string" &&
      addressOrDomain?.toString().toLowerCase().endsWith(".stark")
    ) {
      starknetIdNavigator
        ?.getStarknetId(addressOrDomain)
        .then((id) => {
          getIdentityData(id).then((data: Identity) => {
            if (data.error) {
              setNotFound(true);
              return;
            }
            setIdentity({
              ...data,
              id: id.toString(),
            });
            if (hexToDecimal(address) === data.addr) setIsOwner(true);
            setInitProfile(true);
          });
        })
        .catch(() => {
          return;
        });
    } else if (
      typeof addressOrDomain === "string" &&
      isHexString(addressOrDomain)
    ) {
      starknetIdNavigator
        ?.getStarkName(hexToDecimal(addressOrDomain))
        .then((name) => {
          if (name) {
            starknetIdNavigator
              ?.getStarknetId(name)
              .then((id) => {
                getIdentityData(id).then((data: Identity) => {
                  if (data.error) return;
                  setIdentity({
                    ...data,
                    id: id.toString(),
                  });
                  if (hexToDecimal(address) === data.addr) setIsOwner(true);
                  setInitProfile(true);
                });
              })
              .catch(() => {
                return;
              });
          } else {
            setIdentity({
              id: "0",
              addr: hexToDecimal(addressOrDomain),
              domain: minifyAddress(addressOrDomain),
              is_owner_main: false,
            });
            setIsOwner(false);
            setInitProfile(true);
          }
        });
    } else {
      setNotFound(true);
    }
  }, [addressOrDomain, address]);

  useEffect(() => {
    if (identity) {
      retrieveAssets(
        `https://${
          process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "api-testnet" : "api"
        }.aspect.co/api/v0/assets?owner_address=${decimalToHex(identity.addr)}`
      ).then((data) => {
        setUserNft(data.assets);
      });
    }
    // retrieveAssets(
    //   `https://${
    //     process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "api-testnet" : "api"
    //   }.aspect.co/api/v0/assets?owner_address=0x00f1f33769d82e5e9b2c423fa3ccc1f64d1a241363aca709c2f58bade3f96690`
    // ).then((data) => {
    //   setUserNft(data.assets);
    // });
  }, [identity, addressOrDomain, address]);

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
        const filteredAssets = filterAssets(data.assets);
        const assets = [...accumulatedAssets, ...filteredAssets];
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
    return assets;
    // todo: uncomment when we have the right values in NFTContracts
    // return assets.filter((obj) =>
    //   NFTContracts.includes(hexToDecimal(obj.contract_address))
    // );
  };

  return identity && identity.addr && userNft.length > 0 ? (
    <>
      <div style={{ height: "100vh", width: "100vw", zIndex: "0" }}>
        <Scene address={identity?.addr as string} userNft={userNft} />
      </div>
    </>
  ) : null;
};

export default AddressOrDomain;
