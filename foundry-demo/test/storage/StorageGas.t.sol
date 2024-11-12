// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Test} from "forge-std/Test.sol";

contract StorageGas is Test {
    uint256 value;

    function setColdValue(uint256 _value) public returns (uint) {
        uint256 gasStart = gasleft();

        value = _value;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function setWarnValue(uint256 _value) public returns (uint) {
        value = 1024;

        uint256 gasStart = gasleft();

        value = _value;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function resetValue(uint _value) public returns (uint) {
        value = _value;

        uint256 gasStart = gasleft();

        value = _value;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function clearValue() public returns (uint) {
        value = 1024;

        uint256 gasStart = gasleft();

        value = 0;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function readColdValue() public returns (uint) {
        uint256 gasStart = gasleft();

        value;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function setWarnValue() public returns (uint) {
        value = 1;
        uint256 gasStart = gasleft();

        value;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }
}

contract StorageGasTest is Test {
    StorageGas instance;

    function setUp() public {
        instance = new StorageGas();
    }

    function testColdStorageGasCosts() public {
        uint gasUsed = instance.setColdValue(1);
        emit log_named_uint("write cold storage gas usage", gasUsed);
    }

    function testWarnStorageGasCosts() public {
        uint gasUsed = instance.setWarnValue(1);
        emit log_named_uint("write warn storage gas usage", gasUsed);
    }

    function testResetStorageGasCosts() public {
        uint gasUsed = instance.resetValue(1024);
        emit log_named_uint("reset storage gas usage", gasUsed);
    }

    function testClearGasCosts() public {
        uint gasUsed = instance.clearValue();
        emit log_named_uint("clear storage gas usage", gasUsed);
    }

    function test_ReadColdGasCosts() public {
        uint gasUsed = instance.readColdValue();
        emit log_named_uint("read clod storage gas usage", gasUsed);
    }

    function test_ReadWarnGasCosts() public {
        uint gasUsed = instance.readColdValue();
        emit log_named_uint("read warn storage gas usage", gasUsed);
    }
}
