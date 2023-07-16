import { Land } from "@/components/scene/Land";
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

  return identity && identity.addr ? (
    <>
      <Land address={identity.addr} />
    </>
  ) : null;
};

export default AddressOrDomain;
