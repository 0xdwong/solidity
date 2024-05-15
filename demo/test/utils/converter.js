const { expect } = require('chai');
const { ethers } = require('hardhat');

let instance;
let accounts = [];
let owner;

async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    instance = await ethers.deployContract("Converter");
}

describe('Converter', () => {

    before(async () => {
        await init();
    });

    it('addressToUint', async () => {
        // const result = await instance.addressToUint('0x5FbDB2315678afecb367f032d93F642f64180aa3');
        const result = await instance.addressToUint('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512');
        console.log(result);
    });
});