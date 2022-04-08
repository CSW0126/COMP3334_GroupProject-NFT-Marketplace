import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";


const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

export default config;
