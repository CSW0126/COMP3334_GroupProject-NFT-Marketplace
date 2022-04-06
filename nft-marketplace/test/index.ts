import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { constants as ethersConstants, Contract } from "ethers";
import { ethers } from "hardhat";

describe("NFTMarket", () => {
  let nftMarket: Contract;

  before(async () => {
    //deploy the NFTMarket contract
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    nftMarket = await NFTMarket.deploy()
    await nftMarket.deployed();
  });

  //test CreateNFT
  describe("CreateNFT", () => {
    it("should deploy the contract", async () => {
      //call createNFT function
      const tokenURI = 'https://some.url/nft/1';
      const transaction =  await nftMarket.createNFT(tokenURI);
      const receipt = await transaction.wait();

      //assert that the new NFT uri is the same as the one we passed to the function
      const tokenID = receipt.events[0].args.tokenId;
      const mintedTokenURI = await nftMarket.tokenURI(tokenID);
      expect(mintedTokenURI).to.equal(tokenURI);
      //console.log(tokenID);

      //assert that the new NFT owner address is equal to the transaction creator
      const ownerAddress = await nftMarket.ownerOf(tokenID);
      const signers = await ethers.getSigners();
      const currentAddress = await signers[0].getAddress();
      expect(ownerAddress).to.equal(currentAddress);
    });
  });
});
