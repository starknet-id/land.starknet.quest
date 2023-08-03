import { useContext, useEffect, useState } from "react";
import { StarknetIdJsContext } from "../context/StarknetIdJsProvider";

type DomainData = {
  domain: string;
  error?: string;
};

export function useDomainFromAddress(
  address: string | BigInt | undefined
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
