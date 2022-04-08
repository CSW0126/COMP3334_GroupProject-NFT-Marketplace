import { Contract } from "ethers";
import CreationPage from "modules/CreationPage";
import { CreationValues } from "modules/CreationPage/CreationForm";
import NFTMarket from '../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import useSigner from "state/signer";
import { TransactionResponse } from "@ethersproject/abstract-provider";

const NFTMARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string;

const useNFTMarket = () => {
    const { signer } = useSigner();
    const nft_market = new Contract(NFTMARKET_ADDRESS, NFTMarket.abi, signer);

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
    }

    return { createNFT };
}

export default useNFTMarket;