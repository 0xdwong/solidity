const { expect } = require('chai');
const { ethers } = require('hardhat');

let instance;
let accounts = [];
let owner;

async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    instance = await ethers.deployContract("CustomErrorsInRequire");
}

describe('CustomErrorsInRequire', () => {

    before(async () => {
        await init();
    });

    describe('CustomErrorsInRequire', () => {
        it('should succeed', async () => {
            const receiver = accounts[1].address;
            const amount = 10;

            await instance.connect(owner).transfer(receiver, amount);

            expect(await instance.balance(receiver)).to.equal(amount);
        });

        it('should failed', async () => {
            const receiver = accounts[1].address;
            const balance = await instance.balance(owner.address);
            const amount = balance + 1n;

            await expect(
                instance.connect(owner).transfer(receiver, amount)
            ).to.be.revertedWithCustomError(instance, 'InsufficientBalance')
                .withArgs(balance, amount);
        });
    })
});