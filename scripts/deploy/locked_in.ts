import { ethers } from "hardhat";
import { LOCKED_IN } from "../../typechain-types";

const deploy = async () => {
    const lockedInFactory = await ethers.getContractFactory("LOCKED_IN");
    const LOCKED_IN = await lockedInFactory.deploy();
    console.log(`LOCKED_IN DEPLOYED AT`, await LOCKED_IN.getAddress());
};

deploy()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
