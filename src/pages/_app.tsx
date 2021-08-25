import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";

import theme from "../lib/theme";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  const router = useRouter();

  React.useEffect(() => {
    function handleRouteChange(url: string) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
        page_path: url,
      });
    }

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <>
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
    </>
  );
}
