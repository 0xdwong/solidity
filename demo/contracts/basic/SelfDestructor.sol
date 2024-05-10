// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SelfDestructor {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function destroy(address recipient) public payable {
        require(msg.sender == owner, "Only owner can call this function");

        // 销毁合约，并将余额发送到指定的地址
        selfdestruct(payable(recipient));
    }
}
