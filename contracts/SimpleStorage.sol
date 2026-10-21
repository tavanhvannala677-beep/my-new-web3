// SPDX-License-Identifier: MIT
pragma solidity ^0.8.37;

/// @title SimpleStorage — Workshop Lab 2
/// @notice Stores one number on the blockchain and remembers who changed it last
contract SimpleStorage {
    // private: other contracts cannot read it (but anyone can still see the data on-chain!)
    uint256 private favoriteNumber;

    // public: Solidity generates a getter function automatically
    address public lastUpdatedBy;

    // Event: lets the frontend / explorer follow changes
    event NumberChanged(address indexed by, uint256 newNumber);

    /// @notice Write — costs gas, MetaMask asks you to confirm
    function store(uint256 _number) public {
        favoriteNumber = _number;
        lastUpdatedBy = msg.sender;
        emit NumberChanged(msg.sender, _number);
    }

    /// @notice Read — view function, free to call (no gas)
    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }
}
