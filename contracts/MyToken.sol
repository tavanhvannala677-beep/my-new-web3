// SPDX-License-Identifier: MIT
pragma solidity ^0.8.37;

import {ERC20} from "@openzeppelin/contracts@5.1.0/token/ERC20/ERC20.sol";

/// @title MyToken — Lab 3: your own ERC-20 token
/// @notice Change the name, symbol and supply to your own
contract MyToken is ERC20 {
    constructor() ERC20("Lao Student Token", "LST") {
        // decimals() = 18 → 1 token = 10^18 smallest units (like ETH/wei)
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }
}
