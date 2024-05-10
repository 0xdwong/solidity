const { expect } = require('chai');
const { ethers } = require('hardhat');

let vulnerableContract, attackerContract;
let accounts = [];
let owner, account1;
const ONE_ETH = ethers.parseUnits('1.0', "ether");

async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    account1 = accounts[1];

    vulnerableContract = await ethers.deployContract("Vulnerable");
    const vulnerableContractAddr = await vulnerableContract.getAddress();
    attackerContract = await ethers.deployContract("Attacker", [vulnerableContractAddr]);
}

describe('attack', () => {

    before(async () => {
        await init();
    });

    describe('attack', () => {
        it('reentry-failed', async () => {
            // deposit 1 ETH to vulnerableContract
            await vulnerableContract.connect(owner).deposit({ value: ONE_ETH });

            await expect(
                attackerContract.connect(account1).attack({ value: ONE_ETH })
            ).to.be.revertedWith("Transfer failed");
        });

        it.skip('reentry-succeed', async () => {
            // deposit 1 ETH to vulnerableContract
            await vulnerableContract.connect(owner).deposit({ value: ONE_ETH.mul(1) });

            // deposit 1 ETH but withdraw 2 ETH
            await attackerContract.connect(account1).attack({ value: ONE_ETH });

            // vulnerableContract ETH balance should be 0
            const ethBalance_vulnerableContrac = await ethers.provider.getBalance(vulnerableContract.address);
            expect(ethBalance_vulnerableContrac).to.equal(0);

            // attackerContract ETH balance should be 2 ETH
            const ethBalance_attackerContrac = await ethers.provider.getBalance(attackerContract.address);
            expect(ethBalance_attackerContrac).to.equal(TWO_ETH)
        });
    })
});