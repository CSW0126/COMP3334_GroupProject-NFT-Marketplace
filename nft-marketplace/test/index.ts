import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { constants as ethersConstants, Contract } from "ethers";
import { ethers } from "hardhat";

describe("NFTMarket", () => {
  let nftMarket: Contract;
  let signers: SignerWithAddress[];

  before(async () => {
    //deploy the NFTMarket contract
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    nftMarket = await NFTMarket.deploy()
    await nftMarket.deployed();
    //0 is the owner
    signers = await ethers.getSigners();
  });

  //create NFT for test
  const createNFT = async (tokenURI: string) =>{
    const transaction = await nftMarket.createNFT(tokenURI);
    const receipt = await transaction.wait();
    const tokenID = receipt.events[0].args.tokenId;
    return tokenID;
  }

  //create and list NFT for test
  const createAndListNFT = async (price: number) =>{
    const tokenID = await createNFT("https://www.example.com/token/1");
    const transaction = await nftMarket.listNFT(tokenID, price);
    await transaction.wait();
    return tokenID;
  }

  //test CreateNFT
  describe("CreateNFT", () => {
    it("should create NFT with correct owner and uri", async () => {
      //call createNFT function
      const tokenURI = 'https://www.example.com/token/1';
      const transaction = await nftMarket.createNFT(tokenURI);
      const receipt = await transaction.wait();
      const tokenID = receipt.events[0].args.tokenId;

      //assert that the new NFT uri is the same as the one we passed to the function
      const mintedTokenURI = await nftMarket.tokenURI(tokenID);
      expect(mintedTokenURI).to.equal(tokenURI);
      //console.log(tokenID);

      //assert that the new NFT owner address is equal to the transaction creator
      const ownerAddress = await nftMarket.ownerOf(tokenID);
      const currentAddress = await signers[0].getAddress();
      expect(ownerAddress).to.equal(currentAddress);

      const args = receipt.events[1].args;
      // console.log(args)
      expect(args.tokenID).to.equal(tokenID);
      expect(args.to).to.equal(ownerAddress);
      expect(args.tokenURI).to.equal(tokenURI);
      expect(args.price).to.equal(0);
    });
  });

  describe("listNFT", () => {
    const tokenURI = 'https://www.example.com/token/1';
    it("should revert if price is 0", async () => {
      //call listNFT function with 0 price
      const tokenID = await createNFT(tokenURI);
      const transaction = nftMarket.listNFT(tokenID, 0);
      await expect(transaction).to.be.revertedWith("price must be greater than 0");

    });

    it("should revert if not call by owner", async () => {
      const tokenID = await createNFT(tokenURI);
      const transaction = nftMarket.connect(signers[1]).listNFT(tokenID, 1);
      await expect(transaction).to.be.revertedWith("ERC721: transfer caller is not owner nor approved");
    });

    it("should list the nft for sell", async () => {
      const price = 9;
      const tokenID = await createNFT(tokenURI);
      const transaction = await nftMarket.listNFT(tokenID, price);
      const receipt = await transaction.wait();
      //owner transfer to nftMarket
      const ownerAddress = await nftMarket.ownerOf(tokenID);
      expect(ownerAddress).to.equal(nftMarket.address);

      //correct args
      const args = receipt.events[2].args;
      expect(args.tokenID).to.equal(tokenID);
      expect(args.to).to.equal(nftMarket.address);
      expect(args.tokenURI).to.equal("");
      expect(args.price).to.equal(price);
    });
  });

  describe("buyNFT", async () => {
    it("should revert if NFT is not listed for sale", async () => {
      const transaction = nftMarket.buyNFT(3334);
      await expect(transaction).to.be.revertedWith("This NFT is not listed for sale");
    });

    it("should revert if NFT if buy with different price", async () => {
      const price = 3334;
      const tokenID = await createAndListNFT(price);
      const transaction = nftMarket.buyNFT(tokenID, {value: price + 1});
      await expect(transaction).to.be.revertedWith("incorrect price");
      const transaction2 = nftMarket.buyNFT(tokenID, {value: price - 1});
      await expect(transaction2).to.be.revertedWith("incorrect price");
    });

    it("should transfer the owner to the buyer", async () => {
      const price = 100;
      const sellerShouldGet = price * 0.95;
      const contractShouldGet = price * 0.05;
      const buyer = signers[2];

      const oldContractBalance = await nftMarket.provider.getBalance(nftMarket.address);

      const tokenID = await createAndListNFT(price);
      //await new Promise((resolve) => setTimeout(resolve, 100));
      const oldSellerBalance = await signers[0].getBalance();
      const transaction = await nftMarket.connect(buyer).buyNFT(tokenID, {value: price});
      const receipt = await transaction.wait();

      //95% add to seller balance
      //await new Promise((resolve) => setTimeout(resolve, 100));
      const newSellerBalance = await signers[0].getBalance();
      const diff = newSellerBalance.sub(oldSellerBalance);
      expect(diff).to.equal(sellerShouldGet);

      //5% add to contract balance
      const newContractBalance = await nftMarket.provider.getBalance(nftMarket.address);
      const diff2 = newContractBalance.sub(oldContractBalance);
      expect(diff2).to.equal(contractShouldGet);

      //NFT is owner transferred to the buyer
      const ownerAddress = await nftMarket.ownerOf(tokenID);
      expect(ownerAddress).to.equal(buyer.address);

      //NFT have correct args
      const args = receipt.events[2].args;
      expect(args.tokenID).to.equal(tokenID);
      expect(args.to).to.equal(buyer.address);
      expect(args.tokenURI).to.equal("");
      expect(args.price).to.equal(0);
    });
  });
});
