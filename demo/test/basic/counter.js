const { expect } = require('chai');
const { ethers, network } = require('hardhat');


let instance;
let instanceAddr;

async function init() {
    const params = [];
    instance = await ethers.deployContract("Counter", params);
    instanceAddr = await instance.getAddress();
}

describe('Counter', () => {

    before(async () => {
        await init();
    });

    describe('get', () => {
        it('should return 0 when deployed', async () => {

            const counter = await instance.get();
            expect(counter).to.equal(0);
        });
    })

    describe('set', () => {
        it('should return the set value', async () => {
            let number = Math.ceil(Math.random()); // 随机整数
            await instance.set(number);
            const counter = await instance.get();
            expect(counter).to.equal(number);
        });
    })
});