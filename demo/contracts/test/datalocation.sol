// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Person {
    string name;
    uint age;
}

contract DataLocation {
    // function hi(string calldata name) external pure returns (string memory) {
    //     return string(abi.encodePacked("Hi, ", name));
    // }

    // function hi2(string calldata name) external pure returns (string memory) {
    //     return _hi2(name);
    // }

    // function _hi2(string calldata name) internal pure returns (string memory) {
    //     return string(abi.encodePacked("Hi, ", name));
    // }

    // function createPerson() public pure returns (string memory, uint) {
    //     Person memory temp = Person("Alice", 30);
    //     temp.age = 31;
    //     return (temp.name, temp.age);
    // }

    // struct Student {
    //     string name;
    //     uint age;
    //     uint grade;
    // }

    // Student[] public students;

    // function modifyStudent(
    //     uint index,
    //     string memory name,
    //     uint age,
    //     uint grade
    // ) public {
    //     Student memory student = students[index];
    //     student.name = name;
    //     student.age = age;
    //     student.grade = grade;
    //     students[index] = student;
    // }

    // function modifyStudent(
    //     uint index,
    //     string memory name,
    //     uint age,
    //     uint grade
    // ) public {
    //     Student memory student = students[index];
    //     student.name = name;
    //     student.age = age;
    //     student.grade = grade;
    //     students[index] = student;
    // }
}
