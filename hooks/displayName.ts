import { minifyAddress, minifyDomain } from "../utils/stringService";
import { useDomainFromAddress } from "./naming";

export function useDisplayName(address: string): string {
  // With our own hook
  const { domain } = useDomainFromAddress(address);
  const toDisplay = domain
    ? minifyDomain(domain)
    : address
    ? minifyAddress(address)
    : "none";

  return toDisplay;
}
