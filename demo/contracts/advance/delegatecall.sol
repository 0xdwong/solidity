// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// contract Caller {
//     address public target;

//     constructor(address _target) {
//         target = _target;
//     }

//     function delegateCallSelfDestruct() public {
//         (bool success, ) = target.delegatecall(
//             abi.encodeWithSignature("destroy(address)", address(this))
//         );

//         require(success, "Delegatecall failed");
//     }
// }