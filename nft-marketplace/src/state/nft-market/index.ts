import { BigNumber, Contract, ethers } from "ethers";
import CreationPage from "modules/CreationPage";
import { CreationValues } from "modules/CreationPage/CreationForm";
import NFTMarket from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import useSigner from "state/signer";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import useOwnedNFTs from "./userOwnedNFTs";
import useOwnedListedNFTs from "./userOwnedListedNFTs";
import { NFT_MARKET_ADDRESS } from "./config";
import useListedNFTs from "./userListedNFTs";
import { NFT } from "./interfaces";

const useNFTMarket = () => {
    const { signer } = useSigner();
    const nft_market = new Contract(NFT_MARKET_ADDRESS, NFTMarket.abi, signer);

    const ownedNFTs = useOwnedNFTs();
    const ownedListedNFTs = useOwnedListedNFTs();
    const listedNFTs = useListedNFTs();

    const createNFT = async (values: CreationValues) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("image", values.image!);
            const response = await fetch('api/nft-storage', { method: "POST", body: formData});
            if (response.status == 201) {
                const json = await response.json();
                // console.log("token_uri", json.uri);
                const transaction: TransactionResponse = await nft_market.createNFT(json.uri);
                await transaction.wait();
            }
        } catch (e) {
            console.log(e);
        }
    };

    const listNFT = async (tokenID:string, price: BigNumber) =>{
        const transaction: TransactionResponse = await nft_market.listNFT(tokenID, price);
        await transaction.wait();
    };

    const cancelListing = async (tokenID:String) =>{
        const transaction: TransactionResponse = await nft_market.cancelListing(tokenID);
        await transaction.wait();
    };

    const buyNFT = async (nft:NFT) =>{
        const transaction: TransactionResponse = await nft_market.buyNFT(nft.id, {value: ethers.utils.parseEther( nft.price), });
        await transaction.wait();
    };

    return { createNFT, listNFT, cancelListing, buyNFT, ...ownedNFTs, ...ownedListedNFTs, ...listedNFTs, };
}

export default useNFTMarket;