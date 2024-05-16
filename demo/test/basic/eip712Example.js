const { expect } = require('chai');
const { ethers, network } = require('hardhat');


let instance;
let instanceAddr;
const DOMAIN_NAME = 'Example-DAPP';
const DOMAIN_VERSION = '1.0';

async function init() {
    const params = [DOMAIN_NAME, DOMAIN_VERSION];
    instance = await ethers.deployContract("EIP712Example", params);
    instanceAddr = await instance.getAddress();
}

describe('EIP712Example', () => {

    before(async () => {
        await init();
    });

    describe('verify', () => {
        it('should return true', async () => {

            const domain = {
                name: DOMAIN_NAME,
                version: DOMAIN_VERSION,
                chainId: network.config.chainId,
                verifyingContract: instanceAddr,
            };

            const signer = ethers.Wallet.createRandom();

            const order = {
                from: signer.address,
                to: ethers.Wallet.createRandom().address,
                amount: 1000,
                details: 'this is an order'
            };

            const types = {
                Order: [
                    { name: 'from', type: 'address' },
                    { name: 'to', type: 'address' },
                    { name: 'amount', type: 'uint256' },
                    { name: 'details', type: 'string' }
                ]
            };
            const signature = await signer.signTypedData(domain, types, order);

            const result = await instance.verify(order, signature);
            expect(result).to.equal(true);
        });
    })
});