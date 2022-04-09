import NFTCard from "components/NFTCard";
import useNFTMarket from "state/nft-market";

const HomePage = () => {
  const {listedNFTs} = useNFTMarket();
  console.log("NFTS: ", listedNFTs);

  return (
    <div className="flex w-full flex-col">
        <div className="flex flex-wrap">
         {listedNFTs?.map((nft) =>( 
         <NFTCard nft={nft} className="mr-4 mb-4" key={nft.id} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
