import WrongNetworkPage from "modules/WrongNetworkPage";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import useSigner from "state/signer";
import CreationPage from "../modules/CreationPage";


const Create: NextPage = () => {
  const { chainId} = useSigner();

  if(chainId != 80001) return <WrongNetworkPage/>
  
  return <CreationPage />;
  
};

export default Create;
