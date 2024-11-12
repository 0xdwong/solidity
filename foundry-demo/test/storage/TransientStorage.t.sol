// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {TransientStorageAssembly, TMultiplier} from "../../src/storage/TransientStorage.sol";

contract TransientStorageAssemblyTest is Test {
    TransientStorageAssembly instance;

    function setUp() public {
        instance = new TransientStorageAssembly();
    }

    function test_example() public {
        instance.example();

        uint256 value;
        assembly {
            value := tload(0x01)
        }

        assertEq(value, 0, "Transient storage should be cleared between calls");
    }
}

contract TMultiplierTest is Test {
    TMultiplier instance;

    function setUp() public {
        instance = new TMultiplier();
    }

    function testFuzz_setMultiplier(uint256 mul) public view {
        instance.multiply(mul);

        uint256 mulAfter = instance.multiplier();

        assertEq(mulAfter, 0);
    }

    function testFuzz_multiply(uint256 value) public view {
        uint256 result = instance.multiply(value);

        assertEq(result, 0);
    }
}

