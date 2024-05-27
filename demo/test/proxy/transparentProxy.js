const { expect } = require('chai');
const { ethers } = require('hardhat');


describe.only("TransparentProxy", async () => {
    let accounts, owner, admin;
    let logicCA, logicCAAddr; // 逻辑合约
    let proxyCA, proxyCAAddr; // 代理合约,具有代理合约的 ABI
    let proxyAsLogicCA; // 代理合约,具有逻辑合约的 ABI,交互用


    async function init() {
        accounts = await ethers.getSigners();
        owner = accounts[0];
        admin = accounts[0];
        adminAddr = await admin.getAddress();

        // 部署逻辑合约
        {
            logicCA = await ethers.deployContract("TLogic");
            logicCAAddr = await logicCA.getAddress();
        }

        // 部署代理合约
        {
            proxyCA = await ethers.deployContract("TransparentProxy", [logicCAAddr]);
            proxyCAAddr = await proxyCA.getAddress();

            proxyAsLogicCA = await ethers.getContractAt("LogicContract", proxyCAAddr);
        }
    }

    beforeEach(async () => {
        await init();
    })

    describe("proxy", async () => {
        it("should correctly set logic address in proxy", async function () {
            expect(await proxyCA.logicAddress()).to.equal(logicCAAddr);
        });

        it("should correctly set admin address in proxy", async function () {
            expect(await proxyCA.adminAddress()).to.equal(adminAddr);
        });

        it("only admin can update logic address", async function () {
            let randomAccount = accounts[9];
            let newLogicAddr = await randomAccount.getAddress();

            // not admin should revert
            await expect(
                proxyCA.connect(randomAccount).upgradeLogic(newLogicAddr)
            ).to.be.revertedWith('Only admin');

            // admin upgradeLogic
            await proxyCA.connect(admin).upgradeLogic(newLogicAddr);
            expect(await proxyCA.logicAddress()).to.equal(newLogicAddr);

        });

        it("only admin can update admin address", async function () {
            let randomAccount = accounts[9];
            let newAdminAddr = await randomAccount.getAddress();

            // not admin should revert
            await expect(
                proxyCA.connect(randomAccount).upgradAdmin(newAdminAddr)
            ).to.be.revertedWith('Only admin');

            // admin upgradAdmin
            await proxyCA.connect(admin).upgradAdmin(newAdminAddr);
            expect(await proxyCA.adminAddress()).to.equal(newAdminAddr);
        });
    })

    describe("getCount", async () => {
        it("count should be 1", async () => {
            const count1 = await proxyAsLogicCA.getCount();

            await proxyAsLogicCA.incrementCounter()

            const count2 = await proxyAsLogicCA.getCount();

            expect(count1).to.equal(0);
            expect(count2).to.equal(1);
        });
    })
});