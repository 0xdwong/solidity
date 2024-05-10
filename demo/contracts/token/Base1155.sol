// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BaseERC1155 is ERC1155 {
    string public name;
    string public symbol;
    mapping(uint256 => uint256) private _tokenSupply;

    constructor(string memory _uri) ERC1155(_uri) {
        name = "BaseERC1155";
        symbol = "BERC1155";
    }

    function mint(uint256 tokenId, uint256 value) public {
        _mint(msg.sender, tokenId, value, "");
        _tokenSupply[tokenId] += value;
    }

    function totalSupply(uint256 tokenId) public view returns (uint256) {
        return _tokenSupply[tokenId];
    }
}
