const { expect } = require('chai');
const { ethers } = require('hardhat');

let contractInstance;
let accounts = [];
let owner;

async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];

    const factory = await ethers.getContractFactory('C');
    contractInstance = await factory.deploy();
    await contractInstance.deployed();
}

describe('C', () => {
    before(async() => {
        await init();
    });
});