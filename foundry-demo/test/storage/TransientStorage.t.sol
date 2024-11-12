// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import "../../src/storage/TransientStorage.sol";

contract TransientStorageTest is Test {
    TransientStorage instance;

    function setUp() public {
        instance = new TransientStorage();
    }

    function test_example() public {
        instance.example();
    }
}
