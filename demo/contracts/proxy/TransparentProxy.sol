// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TLogic {
    uint public count;

    function incrementCounter() public {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}

contract TransparentProxy {
    uint public count;

    constructor(address logic) {
        // 设置逻辑合约地址，存储到特定槽(bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1))
        assembly {
            sstore(
                0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc,
                logic
            )
        }
        // 设置管理员地址，存储到特定槽（bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1)）
        address admin = msg.sender;
        assembly {
            sstore(
                0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103,
                admin
            )
        }
    }

    function upgradeLogic(address newLogic) public {
        require(msg.sender == _admin(), "Only admin");

        assembly {
            sstore(
                0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc,
                newLogic
            )
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

    function _admin() internal view returns (address admin) {
        uint256 value;
        assembly {
            value := sload(
                0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103
            )
        }

        return address(uint160(value));
    }

    fallback() external payable {
        require(msg.sender != _admin(), "Admin not allowed");
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
