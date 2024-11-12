// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract TransientStorage {
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
