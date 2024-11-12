// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TransientStorageAssembly {

    function example() public {
        assembly {
            // 存储值
            tstore(0x01, 100)

            // 其它操作

            // 读取值
            let value := tload(0x01)
        }
    }
}

contract TMultiplier {
    uint public transient multiplier;

    function setMultiplier(uint mul) external {
        multiplier = mul;
    }

    function multiply(uint value) external view returns (uint) {
        return value * multiplier;
    }
} 
