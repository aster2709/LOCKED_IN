import "dotenv/config";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
    solidity: "0.8.13",
    networks: {
        eth_mainnet: {
            url: `https://rpc.ankr.com/eth`,
            accounts: [process.env.PRIVATE_KEY!],
        },
    },
    etherscan: {
        apiKey: process.env.EXPLORER_API_KEY!,
    },
};

export default config;
