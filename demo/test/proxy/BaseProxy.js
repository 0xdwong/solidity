const { expect } = require('chai');
const { ethers } = require('hardhat');


describe.only("BaseProxy", async () => {
    let accounts, owner;
    let logicCA, logicCAAddr; // 逻辑合约
    let proxyCA, proxyCAAddr; // 代理合约,具有代理合约的 ABI
    let proxyAsLogicCA; // 代理合约,具有逻辑合约的 ABI,交互用


    async function init() {
        accounts = await ethers.getSigners();
        owner = accounts[0];

        // 部署逻辑合约
        {
            logicCA = await ethers.deployContract("LogicContract");
            logicCAAddr = await logicCA.getAddress();
        }

        // 部署代理合约
        {
            proxyCA = await ethers.deployContract("BaseProxy", [logicCAAddr]);
            proxyCAAddr = await proxyCA.getAddress();

            proxyAsLogicCA = await ethers.getContractAt("LogicContract", proxyCAAddr);
        }
        console.log('====address====', { logicCAAddr, proxyCAAddr });
    }

    beforeEach(async () => {
        await init();
    })

    describe("logic", async () => {
        it("should correctly set logic address in proxy", async function () {
            expect(await proxyCA.logicAddress()).to.equal(logicCAAddr);
        });
    })

    describe("getCount", async () => {
        it.only("count should be 1", async () => {
            const count = await proxyAsLogicCA.getCount();
            console.log('====count====', count);

            // expect(await proxyCA.incrementCounter()).to.equal(name);

            expect(count).to.equal(0);
        });
    })
});