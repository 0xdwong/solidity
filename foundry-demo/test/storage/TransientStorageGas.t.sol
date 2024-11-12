// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";

contract TransientStorageGas {
    uint256 transient value;

    function setColdValue(uint256 _value) public returns (uint){
        uint256 gasStart = gasleft();

        value = _value;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function setWarnValue(uint256 _value) public returns (uint){
        value = 1024;

        uint256 gasStart = gasleft();
        value = _value;
        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function clearValue() public returns (uint) {
        value = 1;

        uint256 gasStart = gasleft();
        value = 0;
        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function readColdValue() public returns (uint){
        uint256 gasStart = gasleft();

        value ;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }

    function setWarnValue() public returns (uint){
        value = 1;
        uint256 gasStart = gasleft();

        value ;

        uint256 gasUsed = gasStart - gasleft();

        return gasUsed;
    }
}


contract TransientStorageGasTest is Test {
    TransientStorageGas instance;

    function setUp() public {
        instance = new TransientStorageGas();
    }

    function test_ColdStorageGasCosts() public {

        uint gasUsed = instance.setColdValue(1);

        emit log_named_uint("write cold storage gas usage", gasUsed);
    }

    function test_WarnStorageGasCosts() public {
        uint gasUsed = instance.setWarnValue(1);
        emit log_named_uint("write warn storage gas usage", gasUsed);
    }

    function test_ClearGasCosts() public {
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
