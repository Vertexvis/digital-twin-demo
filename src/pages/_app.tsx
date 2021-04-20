import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
import theme from "../lib/theme";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  React.useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) jssStyles.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Vertex Time Series</title>
        <link rel="icon" href="/favicon-512x512.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}
