import BN from "bn.js";
import { useContext, useEffect, useState } from "react";
import { utils } from "starknetid.js";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";
import { basicAlphabet } from "../utils/constants";
import { minifyAddress, minifyDomain } from "./stringService";

// TODO: remove and use utils.decodeDomain when dapp uses starknet.js v5
export function useDecoded(encoded: BN[]): string {
  const convertEncoded = encoded.map((element) => BigInt(element.toString()));
  return utils.decodeDomain(convertEncoded);
}

type DomainData = {
  domain: string;
  error?: string;
};

export function useDomainFromAddress(
  address: string | BN | undefined
): DomainData {
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [domain, setDomain] = useState<string>("");
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!address) return;
    const fetchStarkName = async () => {
      const domain = await starknetIdNavigator
        ?.getStarkName(address.toString())
        .catch((err) => {
          setError(err);
        });
      setDomain(domain as string);
    };
    fetchStarkName();
  }, [starknetIdNavigator, address]);

  return { domain, error };
}

type AddressData = {
  address?: string;
  error?: string;
};

export function useAddressFromDomain(domain: string): AddressData {
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [address, setAddress] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!domain) return;
    const fetchAddress = async () => {
      const addr = await starknetIdNavigator
        ?.getAddressFromStarkName(domain)
        .catch((err) => {
          setError(err);
        });
      setAddress(addr as string);
    };
    fetchAddress();
  }, [starknetIdNavigator, domain]);

  return { address, error };
}

export function useIsValid(domain: string | undefined): boolean | string {
  if (!domain) domain = "";

  for (const char of domain) if (!basicAlphabet.includes(char)) return char;
  return true;
}

type TokenIdData = {
  tokenId?: number;
  error?: string;
};

export function useTokenIdFromDomain(domain: string): TokenIdData {
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [tokenId, setTokenId] = useState<number | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!domain) return;
    const fetchAddress = async () => {
      const token = await starknetIdNavigator
        ?.getStarknetId(domain)
        .catch((err) => {
          setError(err);
        });
      setTokenId(token as number);
    };
    fetchAddress();
  }, [starknetIdNavigator, domain]);

  return { tokenId, error };
}

export function useDisplayName(address: string): string {
  const { domain } = useDomainFromAddress(address);
  const toDisplay = domain
    ? minifyDomain(domain)
    : address
    ? minifyAddress(address)
    : "none";

  return toDisplay;
}
