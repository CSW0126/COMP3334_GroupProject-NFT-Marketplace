import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
require('dotenv').config();


const RINKEBY_URL = process.env.RINKEBY_URL as string;
const PRIVATE_KEY = process.env.PRIVATE_KEY as string;

console.log("RU: ", RINKEBY_URL);

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    rinkeby: {
      url: RINKEBY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
