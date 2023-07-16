import { StarknetIdJsProvider } from "@/context/StarknetIdJsProvider";
import "@/styles/globals.css";
import { createTheme } from "@mui/material";
import { InjectedConnector, StarknetConfig } from "@starknet-react/core";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  const connectors = [
    new InjectedConnector({ options: { id: "argentX" } }),
    new InjectedConnector({ options: { id: "braavos" } }),
  ];

  const theme = createTheme({
    palette: {
      primary: {
        main: "#6affaf",
        light: "#5ce3fe",
      },
      secondary: {
        main: "#f4faff",
        dark: "#eae0d5",
      },
      background: {
        default: "#29282b",
      },
    },
  });

  return (
    <StarknetConfig connectors={connectors} autoConnect>
      <StarknetIdJsProvider>
        <Component {...pageProps} />
      </StarknetIdJsProvider>
    </StarknetConfig>
  );
}
