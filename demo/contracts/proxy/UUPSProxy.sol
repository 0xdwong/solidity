// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UUPSLogic {
    uint public count;

    constructor() {}

    function incrementCounter() public {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }

    function upgradeLogic(address newAddress) public {
        _authorizeUpgrade();

        assembly {
            sstore(
                0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc, //ERC-1967 IMPLEMENTSLOT
                newAddress
            )
        }
    }

    function _authorizeUpgrade() internal {
        // 实现自己的逻辑控制权限，eg:
        address value;

        assembly {
            value := sload(
                0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103
            ) //ERC-1967 ADMIN_SLOT
        }

        address admin = address(uint160(value));

        require(msg.sender == admin, "Only admin");
    }
}

contract UUPSProxy {
    uint public count;

    constructor(address logicAddress) {
        address admin = msg.sender;

        assembly {
            sstore(
                0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc,
                logicAddress
            ) //ERC-1967 IMPLEMENTATION_SLOT

            sstore(
                0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103,
                admin
            ) //ERC-1967 ADMIN_SLOT
        }
    }

    function _logic() internal view returns (address logic) {
        uint256 value;
        assembly {
            value := sload(
                0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc
            )
        }

        return address(uint160(value));
    }

    fallback() external payable {
        _fallback(_logic());
    }

    receive() external payable {
        _fallback(_logic());
    }

    function _fallback(address logic) internal {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), logic, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}
