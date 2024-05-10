const { expect } = require('chai');

let accounts = [];
let owner;
let instance;
let instanceAddr;


async function init() {
    accounts = await ethers.getSigners();
    owner = accounts[0];
    instance = await ethers.deployContract("SelfDestructor");
    instanceAddr = await instance.getAddress();
}

describe('SelfDestructor', () => {

    before(async () => {
        await init();
    });

    describe('destroy', () => {
        it('should set contract code to "0x" when destroyed', async () => {
            let before = await ethers.provider.getCode(instanceAddr);

            const recipient = await owner.getAddress();
            await instance.destroy(recipient);

            let after = await ethers.provider.getCode(instanceAddr);

            expect(before).to.not.equal('0x');
            expect(after).to.equal('0x');
        });
    })
});