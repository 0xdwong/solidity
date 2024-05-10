const { expect } = require('chai');
const { ethers } = require('hardhat');


describe("BaseERC721-2", async () => {
    let contract, contractAddr;
    let receivercontract, receivercontractAddr;
    let accounts, owner;
    const name = 'MyNFT';
    const symbol = 'MNFT';
    const baseURI = 'https://images.example.com/';

    const randomAccount = ethers.Wallet.createRandom();
    const randomAddr = randomAccount.address;
    const ZeroAddress = ethers.ZeroAddress;


    async function init() {
        // 部署合约
        accounts = await ethers.getSigners();
        owner = accounts[0];

        // const factory = await ethers.getContractFactory('BaseERC721');
        // contract = await factory.deploy();
        // await contract.deployed();

        contract = await ethers.deployContract("BaseERC721_2");
    }

    beforeEach(async () => {
        await init();
    })

    describe("IERC721Metadata", async () => {
        it("name", async () => {
            expect(await contract.name()).to.equal(name);
        });

        it("symbol", async () => {
            expect(await contract.symbol()).to.equal(symbol);
        });

        // describe("tokenURI", async () => {
        //     it("URI query for nonexistent token should revert", async () => {
        //         const NONE_EXISTENT_TOKEN_ID = 1234
        //         await expect(
        //             contract.tokenURI(NONE_EXISTENT_TOKEN_ID)
        //         ).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");
        //     });

        //     it('Should return baseURI when tokenId exists', async function () {
        //         const tokenId = 1
        //         await contract.connect(owner).mint(randomAddr, tokenId);

        //         const expectURI = baseURI + String(tokenId);
        //         expect(await contract.tokenURI(tokenId)).to.equal(expectURI);
        //     });
        // })
    })
});