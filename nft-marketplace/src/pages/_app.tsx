import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import type { AppProps } from "next/app";
import "react-toastify/dist/ReactToastify.css";
import { SignerProvider } from "state/signer";
import Layout from "../components/Layout";
import "../styles/globals.css";
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import 'tailwindcss/tailwind.css';


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
          <ThemeProvider attribute="class">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </ApolloProvider>
      </SignerProvider>
    </>
  );
};

export default MyApp;
