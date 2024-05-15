// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LogicContract {
    address public not_used;
    uint public count;

    function incrementCounter() public {
        count += 1;
    }

    function getCount() public view returns (uint) {
        return count;
    }
}

contract BaseProxy {
    address public logicAddress;
    uint public count;

    constructor(address _logic) {
        logicAddress = _logic;
    }

    // should be restricted to admin
    function upgradeLogic(address _newLogic) public {
        logicAddress = _newLogic;
    }

    fallback() external payable {
        _fallback(logicAddress);
    }

    receive() external payable {
        _fallback(logicAddress);
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
