import "@nomiclabs/hardhat-waffle";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";

// const RINKEBY_URL = process.env.RINKEBY_URL as string;
const URL = process.env.MORALIS_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    testnet: {
      url: URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;