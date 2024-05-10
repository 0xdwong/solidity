const { expect } = require('chai');
const { ethers } = require('hardhat');
// const hardhat = require('hardhat');

let contractInstance;
let accounts = [];
let owner;

async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    contractInstance = await ethers.deployContract("DataLocation");
    // console.log('====contract address====', await contractInstance.getAddress());
}

describe('DataLocation', () => {

    before(async () => {
        await init();
    });

    it('test', async () => {
        // await contractInstance.hi2('Alice');
        // await contractInstance.createPerson();
    });
});