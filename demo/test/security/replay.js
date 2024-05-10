const { expect } = require('chai');
const { ethers } = require('hardhat');

let contract;
let contractAddr = '';
let accounts = [];
let owner, account1;
const ONE_ETH = ethers.parseUnits('1.0', "ether");

async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    account1 = accounts[1];

    contract = await ethers.deployContract("Replay");
    contractAddr = await contract.getAddress
}

describe('replay', () => {

    before(async() => {
        await init();
    });

    describe('withdraw', () => {
        it('replay-succeed', async() => {
            // 2ETH
            await contract.connect(account1).deposit({value: ONE_ETH * 2n });
            
            const signature = '0x318a5191c5';
            const nonce = 'ZJWtocWWUDk7'
            await contract.connect(account1).withdraw(ONE_ETH, nonce, signature);
            // using the same signature to replay
            await expect (
                contract.connect(account1).withdraw(ONE_ETH, nonce, signature)
            ).to.be.revertedWith('Used nonce');
        });
    })
});