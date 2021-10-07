import "@vertexvis/viewer/dist/viewer/viewer.css";

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import theme from "../lib/theme";

const cache = createCache({ key: "css", prepend: true });
cache.compat = true;

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const { events } = useRouter();

  React.useEffect(() => {
    function handleChange(url: string) {
      /* eslint-disable @typescript-eslint/ban-ts-comment */
      // @ts-ignore
      if (window.gtag) {
        // @ts-ignore
        window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
          cookie_flags: "SameSite=None;Secure",
          page_path: url,
        });
      }
      /* eslint-enable @typescript-eslint/ban-ts-comment */
    }

    events.on("routeChangeComplete", handleChange);
    return () => {
      events.off("routeChangeComplete", handleChange);
    };
  }, [events]);

  return (
    <React.StrictMode>
      <CacheProvider value={cache}>
        <Head>
          <title>Vertex Digital Twin</title>
          <link rel="icon" href="/favicon-512x512.png" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
          <meta
            name="description"
            content="Example of how to visualize IoT time series data aligned to your 3D digital twin using the Vertex platform."
          />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </React.StrictMode>
  );
}
