import OwnedPage from "modules/OwnedPage";
import WrongNetworkPage from "modules/WrongNetworkPage";
import type { NextPage } from "next";
import useSigner from "state/signer";

const Owned: NextPage = () => {
  const { chainId } = useSigner();

  if(chainId != 80001) return <WrongNetworkPage/>
  return <OwnedPage />;
};

export default Owned;
