const { ethers, network } = require("hardhat");

async function main() {
    let [owner] = await ethers.getSigners();
    console.log(`\ndeployer:`, owner.address);


    // 部署 SelfDestructor 合约
    let selfDestructAddr = '';
    let selfDestructContract = '';
    {
        let contractName = 'SelfDestructor';

        let params = [];
        const instance = await ethers.deployContract(contractName, params);
        await instance.waitForDeployment();

        const instanceAddr = await instance.getAddress();

        selfDestructContract = instance;
        selfDestructAddr = instanceAddr;

        console.log(`\ncontract[${contractName}] deployed to:`, instanceAddr);
    }

    // 部署 Caller 合约
    let callerAddr = '';
    let callerContract = '';

    {
        let contractName = 'Caller';

        let params = [selfDestructAddr];
        const instance = await ethers.deployContract(contractName, params);
        await instance.waitForDeployment();

        const instanceAddr = await instance.getAddress();

        callerContract = instance;
        callerAddr = instanceAddr;

        console.log(`\ndeployer:`, owner.address);
        console.log(`\ncontract[${contractName}] deployed to:`, instanceAddr);
    }


    console.log('====callerContract code====', await ethers.provider.getCode(callerAddr));

    // 调用 CallerContract 合约的 delegateCallSelfDestruct 方法
    await callerContract.delegateCallSelfDestruct();

    console.log('====callerContract code====', await ethers.provider.getCode(callerAddr));
    console.log('====selfDestructor code====', await ethers.provider.getCode(selfDestructAddr));
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });