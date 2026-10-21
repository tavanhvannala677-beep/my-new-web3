// SPDX-License-Identifier: MIT
pragma solidity ^0.8.37;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts@5.1.0/token/ERC721/extensions/ERC721URIStorage.sol";

/// @title MyNFT — Lab 4: mint an NFT into your own wallet
/// @notice Anyone can mint (good for a workshop). Real projects should add Ownable / a supply cap
contract MyNFT is ERC721URIStorage {
    uint256 private _nextTokenId;

    constructor() ERC721("Lao NFT", "LNFT") {}

    /// @param uri Link to the metadata JSON (ipfs://... or https://...)
    function mint(string memory uri) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function totalMinted() public view returns (uint256) {
        return _nextTokenId;
    }
}
