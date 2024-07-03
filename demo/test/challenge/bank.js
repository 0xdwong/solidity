const { expect } = require('chai');
const { ethers } = require('hardhat');


let contract;
let contractAddr;
let accounts;
let deployer;
let deployerAddr;

async function init() {
    const params = [];
    contract = await ethers.deployContract("Bank", params);
    contractAddr = await contract.getAddress();
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    deployerAddr = deployer.address;
}

describe('Bank', () => {

    beforeEach(async () => {
        await init();
    });

    describe('owner', () => {
        it('owner should be the deployer', async () => {
            const owner = await contract.owner();
            expect(owner).to.equal(deployerAddr);
        });
    })


    describe('balances', () => {
        it('balance should match send amount when first deposit', async () => {
            for (let depositor of accounts.slice(1)) {
                const amount = ethers.parseEther("1.0"); // 1 ETH

                // 发送 ETH
                await depositor.sendTransaction({
                    to: contractAddr,
                    value: amount,
                });

                const balance = await contract.balances(depositor.address);
                expect(balance).to.equal(amount);
            }
        });

        it('balance should match when deposit multi times', async () => {
            const depositor = accounts[2];
            const amounts = [
                Math.floor(Math.random() * 1000000000),
                Math.floor(Math.random() * 1000000000),
                Math.floor(Math.random() * 1000000000),
                Math.floor(Math.random() * 1000000000),
                Math.floor(Math.random() * 1000000000),
            ];

            for (let amount of amounts) {
                // 发送 ETH
                await depositor.sendTransaction({
                    to: contractAddr,
                    value: amount,
                });
            }

            const sum = amounts.reduce((acc, current) => acc + current, 0);
            const balance = await contract.balances(depositor.address);
            expect(balance).to.equal(BigInt(sum));
        });

        it('should emit Deposit event when "deposit"', async () => {
            const depositor = accounts[1];
            const amount = ethers.parseEther("1.0"); // 1 ETH

            await expect(
                depositor.sendTransaction({
                    to: contractAddr,
                    value: amount,
                })
            ).to.emit(contract, "Deposit")
                .withArgs(depositor.address, amount);
        });
    })

    describe('withdraw', () => {
        it('should withdraw succeed when not more than deposit', async () => {
            const depositor = accounts[2];
            const amount = ethers.parseEther("1.0");//  1 ETH

            // 发送 ETH
            await depositor.sendTransaction({
                to: contractAddr,
                value: amount,
            });

            const withdrawAmount = amount; // same as deposit
            const balanceBefore = await contract.balances(depositor.address);

            // 提款
            await expect(
                contract.connect(deployer).withdraw(depositor, withdrawAmount)
            ).to.emit(contract, "Withdraw")
                .withArgs(depositor.address, amount);

            const balanceAfter = await contract.balances(depositor.address);

            expect(balanceBefore).equal(amount);
            expect(balanceAfter).equal(0);
        });

        it('should revert "Only owner" when not owner withdraw', async () => {
            const to = accounts[2];
            const notOwner = accounts[3];
            const amount = ethers.parseEther("1.0");//  1 ETH

            await expect(
                contract.connect(notOwner).withdraw(to, amount)
            ).to.be.revertedWith('Only owner');
        });

        it('should revert "Insufficent balance" when withdraw amount exceeds contract balance', async () => {
            const depositor = accounts[2];

            const amount = ethers.parseEther("1.0");//  1 ETH

            // 发送 ETH
            await depositor.sendTransaction({
                to: contractAddr,
                value: amount,
            });

            const withdrawAmount = amount + 1n; // exceed 1 wei
            await expect(
                contract.connect(deployer).withdraw(depositor, withdrawAmount)
            ).to.be.revertedWith('Insufficent balance');
        });

        it('should revert "Withdraw amount exceeds balance" when withdraw exceeds deposit', async () => {
            const depositor = accounts[2];
            const depositor2 = accounts[3];
            const amount = ethers.parseEther("1.0");//  1 ETH

            // 发送 ETH
            await depositor.sendTransaction({
                to: contractAddr,
                value: amount,
            });

            // 发送 ETH
            await depositor2.sendTransaction({
                to: contractAddr,
                value: amount,
            });

            const withdrawAmount = amount + 1n; // exceed 1 wei
            await expect(
                contract.connect(deployer).withdraw(depositor, withdrawAmount)
            ).to.be.revertedWith('Withdraw amount exceeds balance');
        });
    })
});