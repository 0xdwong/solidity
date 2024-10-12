require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require('hardhat-abi-exporter');
require('hardhat-docgen');
require("@nomiclabs/hardhat-solhint");
const { removeConsoleLog } = require('hardhat-preprocessor');
require('dotenv').config();


const mnemonic = process.env.MNEMONIC || 'test test test test test test test test test test test junk';
const privateKey = process.env.PRIVATE_KEY;
const scankey = process.env.ETHERSCAN_API_KEY || 'EtherScan API key';

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.27",
            },
            {
                version: "0.8.21",
            },
            {
                version: "0.8.19",
            },
            {
                version: "0.8.0",
            },
            {
                version: "0.4.17",
            }
        ]
    },
    defaultNetwork: 'hardhat',
    settings: {
        optimizer: {
            enabled: true,
            runs: 200
        },
    },
    networks: {
        hardhat: {
            chainId: 31337,
            accounts: {
                count: 10,
                initialIndex: 0,
                mnemonic,
                path: "m/44'/60'/0'/0",
                accountsBalance: '10000000000000000000000', // (10000 ETH)
            },
        },
        local: {
            url: "http://127.0.0.1:8545",
            chainId: 31337,
            accounts: {
                count: 10,
                initialIndex: 0,
                mnemonic,
                path: "m/44'/60'/0'/0",
                accountsBalance: '10000000000000000000000', // (10000 ETH)
            },
        },
        main: {
            url: 'https://eth.llamarpc.com',
            accounts: {
                count: 1,
                initialIndex: 0,
                mnemonic,
                path: "m/44'/60'/0'/0",
            },
            chainId: 1,
        },
        sepolia: {
            url: 'https://rpc.sepolia.org',
            saveDeployments: true,
            accounts: {
                mnemonic: mnemonic,
            },
            chainId: 11155111,
        },
        polygon: {
            url: 'https://polygon.llamarpc.com',
            accounts: {
                mnemonic: mnemonic,
            },
            chainId: 137,
        },
        mumbai: {
            url: 'https://matic-mumbai.chainstacklabs.com',
            accounts: {
                mnemonic: mnemonic,
            },
            gasPrice: 30000000000,
            chainId: 80001,
        },
    },
    etherscan: {
        apiKey: scankey
    },
    gasReporter: {
        enabled: false
    },
    abiExporter: {
        path: './deployments/abi',
        runOnCompile: true,
        clear: true,
        flat: true,
        spacing: 2,
        pretty: true,
    },
    preprocess: {
        eachLine: removeConsoleLog((hre) => !['hardhat', 'dev'].includes(hre.network.name)),
    },
    docgen: {
        path: './docs',
        clear: true,
        runOnCompile: false,
    }
};