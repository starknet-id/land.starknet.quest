import { minifyAddress, minifyDomain } from "../utils/stringService";
import { useDomainFromAddress } from "./naming";

export function useDisplayName(address: string, isMobile: boolean): string {
  const { domain } = useDomainFromAddress(address);
  const toDisplay = domain
    ? minifyDomain(domain, isMobile ? 15 : 18)
    : address
    ? minifyAddress(address)
    : "none";

  return toDisplay;
}
