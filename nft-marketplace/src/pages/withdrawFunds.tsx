import WithdrawPage from "modules/WithdrawPage";
import Home from "pages";
import WrongNetworkPage from "modules/WrongNetworkPage";
import type { NextPage } from "next";
import useSigner from "state/signer";
import React from "react";

const WithDrawFunds: NextPage = () => {
  const { address, chainId } = useSigner();
  const owner = process.env.NEXT_PUBLIC_CONTRACT_OWNER as string;
  if(address != owner){
    if (typeof window !== "undefined") {
      window.location.href = '/'; 
    }
  }
  if(chainId != 80001) return <WrongNetworkPage/>
  return <WithdrawPage />;
};

export default WithDrawFunds;