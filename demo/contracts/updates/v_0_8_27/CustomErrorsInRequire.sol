// SPDX-License-Identifier: Mit
pragma solidity ^0.8.27;

error InsufficientBalance(uint256 available, uint256 required);

contract CustomErrorsInRequire {
    mapping(address => uint) public balance;

    constructor() {
        balance[msg.sender] = 100000;
    }

    function transfer(address to, uint256 amount) public {
        require(
            balance[msg.sender] >= amount,
            InsufficientBalance(balance[msg.sender], amount)
        );

        balance[msg.sender] -= amount;
        balance[to] += amount;
    }
}
