import HomePage from "modules/HomePage";
import WrongNetworkPage from "modules/WrongNetworkPage";
import type { NextPage } from "next";
import useSigner from "state/signer";

const Home: NextPage = () => {
  const { chainId } = useSigner();
  
  if(chainId != 80001) return <WrongNetworkPage/>
  return <HomePage />;

};

export default Home;
