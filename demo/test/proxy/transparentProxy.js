const { expect } = require('chai');
const { ethers } = require('hardhat');


describe("TransparentProxy", async () => {
    let accounts, owner, admin;
    let logicCA, logicCAAddr; // 逻辑合约
    let proxyCA, proxyCAAddr; // 代理合约,具有代理合约的 ABI
    let proxyAsLogicCA; // 代理合约,具有逻辑合约的 ABI,交互用
    const ImplementSlot = '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';
    const Adminslot = '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103';


    async function init() {
        accounts = await ethers.getSigners();
        owner = accounts[0];
        admin = accounts[0];
        adminAddr = await admin.getAddress();

        // 部署逻辑合约
        {
            logicCA = await ethers.deployContract("SimpleTLogic");
            logicCAAddr = await logicCA.getAddress();
        }

        // 部署代理合约
        {
            proxyCA = await ethers.deployContract("SimpleTransparentProxy", [logicCAAddr]);
            proxyCAAddr = await proxyCA.getAddress();

            proxyAsLogicCA = await ethers.getContractAt("SimpleTLogic", proxyCAAddr);
        }
    }

    async function getAddAtSlot(contract, slot) {
        const value = await ethers.provider.getStorage(contract, slot);
        const address = ethers.getAddress(ethers.dataSlice(value, 12, 32));
        return address;
    }

    beforeEach(async () => {
        await init();
    })

    describe("proxy", async () => {
        it("should correctly set logic address in proxy", async function () {
            const logic = await getAddAtSlot(proxyCA, ImplementSlot);

            expect(logic).to.equal(logicCAAddr);
        });

        it("should correctly set admin address in proxy", async function () {
            const admin = await getAddAtSlot(proxyCA, Adminslot);

            expect(admin).to.equal(adminAddr);
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
            expect(await getAddAtSlot(proxyCA, ImplementSlot)).to.equal(newLogicAddr);
        });
    })

    describe("admin", async () => {
        it('should revert "Admin not allowed"', async () => {
            await expect(
                proxyAsLogicCA.connect(admin).getCount()
            ).to.be.revertedWith("Admin not allowed");
        });
    })

    describe("admin", async () => {
        it('should revert "Admin not allowed"', async () => {
            await expect(
                proxyAsLogicCA.connect(admin).getCount()
            ).to.be.revertedWith("Admin not allowed");
        });
    })

    describe("getCount", async () => {
        it("count should be 1 after calling incrementCounter()", async () => {
            const notAdmin = accounts[9]; // call by admin will fail,see above

            const count1 = await proxyAsLogicCA.connect(notAdmin).getCount();

            await proxyAsLogicCA.connect(notAdmin).incrementCounter()

            const count2 = await proxyAsLogicCA.connect(notAdmin).getCount();

            expect(count1).to.equal(0);
            expect(count2).to.equal(1);
        });
    })
});