import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { SignerProvider } from "state/signer";
import { string } from "yup";
import Layout from "../components/Layout";
import "../styles/globals.css";
import Script from 'next/script';
import { useEffect } from "react";
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';


const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URL as string;
const client = new ApolloClient({ cache: new InMemoryCache(), uri: GRAPH_URL });


const MyApp = ({ Component, pageProps }: AppProps) => {
  // useEffect(() => {
  //   import('flowbite')
  // }, []);
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <SignerProvider>
        <ApolloProvider client={client}>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              /** Put your mantine theme override here */
              colorScheme: 'dark',
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MantineProvider>

        </ApolloProvider>
      </SignerProvider>
    </>
  );
};

export default MyApp;
