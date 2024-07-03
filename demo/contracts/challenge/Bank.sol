// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bank {
    address public owner;
    mapping(address => uint256) public balances;

    event Deposit(address indexed depositor, uint256 indexed amount);
    event Withdraw(address indexed to, uint256 indexed amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function withdraw(address to, uint256 amount) public onlyOwner {
        require(address(this).balance >= amount, "Insufficent balance");

        require(balances[to] >= amount, "Withdraw amount exceeds balance");

        payable(to).transfer(amount);
        balances[to] -= amount;
        emit Withdraw(to, amount);
    }

    receive() external payable {
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
