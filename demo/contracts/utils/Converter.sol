// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Converter {
    // 此函数接受一个地址并返回其对应的 uint256 数值
    function addressToUint(address addr) public pure returns (uint256) {
        return uint256(uint160(addr));
    }
}
