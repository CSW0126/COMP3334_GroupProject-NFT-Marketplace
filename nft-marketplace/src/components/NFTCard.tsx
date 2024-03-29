import classNames from "classnames";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import useNFTMarket from "state/nft-market";
import { NFT } from "state/nft-market/interfaces";
import useSigner from "state/signer";
import { ipfsToHTTPS } from "../helpers";
import AddressAvatar from "./AddressAvatar";
import SellPopup from "./SellPopup";

type NFTMetadata = {
  name: string;
  description: string;
  imageURL: string;
};

type error ={
  code: number;
}

type NFTCardProps = {
  nft: NFT;
  className?: string;
  error?: () => void;
};

const NFTCard = (props: NFTCardProps) => {
  const { nft, className,error } = props;
  const {address} = useSigner();
  const {listNFT, cancelListing, buyNFT} = useNFTMarket();
  const [meta, setMeta] = useState<NFTMetadata>();
  const [loading, setLoading] = useState(false);
  const [sellPopupOpen, setSellPopupOpen] = useState(false);


  useEffect(() => {
    const fetchMetadata = async () => {
      const metadataResponse = await fetch(ipfsToHTTPS(nft.tokenURI));
      if (metadataResponse.status != 200) return;
      const json = await metadataResponse.json();
      setMeta({
        name: json.name,
        description: json.description,
        imageURL: ipfsToHTTPS(json.image),
      });
    };
    void fetchMetadata();
  }, [nft.tokenURI]);

  const onButtonClick = async () => {
    if (owned) {
      if (forSale) onCancelClicked();
      else setSellPopupOpen(true);
    } else {
      if (forSale) onBuyClicked();
      else {
        throw new Error(
          "onButtonClick called when NFT is not owned and is not listed, should never happen"
        );
      }
    }
  };

  const onBuyClicked = async () => {
    setLoading(true);
    try{
      await buyNFT(nft);
    }catch(e){
      console.log(e);

      if(e.code == -32603){
        if(error) error();
      }
      

    }
    setLoading(false);
  };

  const onCancelClicked = async () => {
    setLoading(true);
    try{
    await cancelListing(nft.id);
    }catch(e){
      console.log(e);
    }
    setLoading(false);
    //window.location.reload();
  };

  const onSellConfirmed = async (price: BigNumber) => {
    setSellPopupOpen(false);
    setLoading(true);
    try{
    await listNFT(nft.id, price);
    }catch(e){
      console.log(e);
    }
    setLoading(false);
    //window.location.reload();
  };

  const forSale = nft.price != "0";
  const owned = nft.owner == address?.toLowerCase();

  return (
    <div
      className={classNames(
        "flex w-72 flex-shrink-0 flex-col overflow-hidden rounded-xl border font-semibold shadow-sm",
        className
      )}
    >
      {meta ? (
        <img
          src={meta?.imageURL}
          alt={meta?.name}
          className="h-80 w-full object-cover object-center"
        />
      ) : (
        <div className="flex h-80 w-full items-center justify-center">
          loading...
        </div>
      )}
      <div className="flex flex-col p-4">
        <p className="text-lg">{meta?.name ?? "..."}</p>
        <span className="text-sm font-normal">
          {meta?.description ?? "..."}
        </span>
        <AddressAvatar address={nft.owner} />
      </div>
      <button
        className="group flex h-16 items-center justify-center bg-black text-lg font-semibold text-white dark:bg-white dark:text-black"
        onClick={onButtonClick}
        disabled={loading}
      >
        {loading && "Busy..."}
        {!loading && (
          <>
            {!forSale && "SELL"}
            {forSale && owned && (
              <>
                <span className="group-hover:hidden">{nft.price} MATIC</span>
                <span className="hidden group-hover:inline">CANCEL</span>
              </>
            )}
            {forSale && !owned && (
              <>
                <span className="group-hover:hidden">{nft.price} MATIC</span>
                <span className="hidden group-hover:inline">BUY</span>
              </>
            )}
          </>
        )}
      </button>
      <SellPopup
        open={sellPopupOpen}
        onClose={() => setSellPopupOpen(false)}
        onSubmit={onSellConfirmed}
      />
    </div>
  );
};

export default NFTCard;
