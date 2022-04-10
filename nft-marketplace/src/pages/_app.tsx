import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { SignerProvider } from "state/signer";
import { string } from "yup";
import Layout from "../components/Layout";
import "../styles/globals.css";
import Script from 'next/script';
import { useEffect } from "react";


const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_URL as string;
const client = new ApolloClient({ cache: new InMemoryCache(), uri: GRAPH_URL });


const MyApp = ({ Component, pageProps }: AppProps) => {
  // useEffect(() => {
  //   import('flowbite')
  // }, []);
  return (
    <SignerProvider>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </SignerProvider>
  );
};

export default MyApp;
