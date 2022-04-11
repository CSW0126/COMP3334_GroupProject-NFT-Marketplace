import Link from "next/link";
import ConnectButton from "../ConnectButton";
import NavBar from "./NavBar";
import React from 'react'
import AddNetworkBtn from "components/AddNetworkBtn";
import useSigner from "state/signer";
import ThemeSwitchBtn from "components/ThemeSwitchBtn";

const TopBar = () => {
  const { chainId } = useSigner();

  return (
    <div className="fixed top-0 w-full">
      <div className="relative flex w-full items-center px-4  py-4 shadow">
        <Link href="/">
          <a className="text-lg font-bold">COMP3334 NFT Marketplace</a>
        </Link>
        <div className="flex-grow">
          <NavBar />
        </div>
        <div>
          {
            chainId == 80001 ? "" : <AddNetworkBtn />
          }
        </div>

        <ConnectButton />
        <div className="px-5">
          <ThemeSwitchBtn />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
