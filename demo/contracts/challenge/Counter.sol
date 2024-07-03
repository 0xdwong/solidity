// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 counter = 0;

    function get() public view returns (uint256) {
        return counter;
    }

    function set(uint256 counter_) public {
        counter = counter_;
    }
}
