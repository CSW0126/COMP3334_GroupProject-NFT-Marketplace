import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import Web3Modal from 'web3modal';
import { ethers } from "ethers";

type SignerContextType = {
  signer?: JsonRpcSigner;
  address: string;
  balance: string;
  loading: boolean;
  connectWallet: () => Promise<void>;
}

const SignerContext = createContext<SignerContextType>({} as any);
const useSigner = () => useContext(SignerContext);

export const SignerProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [address, setAddress] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<string>();

  const connectWallet = async () => {
    console.log("test connect wallet");
    setLoading(true);
    try {
      const web3modal = new Web3Modal({ cacheProvider: true });
      const instance = await web3modal.connect();
      const provider = new Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const balance = await signer.getBalance();
      setSigner(signer);
      setAddress(address);
      let res = ethers.utils.formatEther(balance);
      res = (+res).toFixed(4);
      setBalance(res);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    const web3modal = new Web3Modal();
    if (web3modal.cachedProvider) connectWallet();
    window.ethereum.on("accountsChanged", connectWallet);
  }, []);

  const contextValue = { signer, address, balance, loading, connectWallet };

  return (
    <SignerContext.Provider value={contextValue}>
      {children}
    </SignerContext.Provider>
  );
};

export default useSigner;