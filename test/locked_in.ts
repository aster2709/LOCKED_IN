import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { Token, Token__factory, LOCKED_IN, LOCKED_IN__factory } from "../typechain-types";
import { expect } from "chai";

describe("LOCKED IN", () => {
    let token: Token, LOCKED_IN: LOCKED_IN, alice: string;
    beforeEach(async () => {
        const tokenFactory = (await ethers.getContractFactory("Token")) as unknown as Token__factory;
        token = await tokenFactory.deploy();
        const lockedInFactory = (await ethers.getContractFactory("LOCKED_IN")) as unknown as LOCKED_IN__factory;
        LOCKED_IN = await lockedInFactory.deploy(await token.getAddress());
        await token.approve(LOCKED_IN, ethers.MaxUint256);
        alice = (await ethers.getSigners())[0].address;
    });
    it("locks in", async () => {
        const balanceBefore = await token.balanceOf(alice);
        await LOCKED_IN.lockIn(1);
        const balanceAfter = await token.balanceOf(alice);
        expect(balanceBefore - balanceAfter).eq(1);
        expect(await token.balanceOf(await LOCKED_IN.getAddress())).eq(1);
        await expect(LOCKED_IN.lockOut()).to.be.revertedWith("BYE BYE");
        await time.increase(14 * 24 * 60 * 60); // 2 weeks
        await LOCKED_IN.lockOut();
        const balanceAfterAgain = await token.balanceOf(alice);
        expect(balanceAfterAgain - balanceAfter).eq(1);
        // cannot withdraw non locked in amount
        await expect(LOCKED_IN.lockOut()).to.be.revertedWith("BYE BYE");
    });
    it("locks in custom", async () => {
        const duration = 24 * 60 * 60; // 1 day
        const balanceBefore = await token.balanceOf(alice);
        await LOCKED_IN.lockInCustom(1, duration);
        const balanceAfter = await token.balanceOf(alice);
        expect(balanceBefore - balanceAfter).eq(1);
        expect(await token.balanceOf(await LOCKED_IN.getAddress())).eq(1);
        await expect(LOCKED_IN.lockOut()).to.be.revertedWith("BYE BYE");
        await time.increase(duration);
        await LOCKED_IN.lockOut();
        const balanceAfterAgain = await token.balanceOf(alice);
        expect(balanceAfterAgain - balanceAfter).eq(1);
    });
    it("locks in multiple times", async () => {
        const duration = 24 * 60 * 60; // 1 day
        await LOCKED_IN.lockIn(100);
        await time.increase(duration);
        await LOCKED_IN.lockIn(200);
        await time.increase(duration);
        await LOCKED_IN.lockInCustom(300, duration);
        await expect(LOCKED_IN.lockOut()).to.be.revertedWith("BYE BYE");
        await time.increase(duration);
        await LOCKED_IN.lockOut();
    });
});
