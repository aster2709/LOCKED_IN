// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title PROOF OF LOCKED IN
 * @author BASED MOGGER ASTER (https://twitter.com/0x_aster)
 *
 * @notice DO NOT TRANSFER TOKENS DIRECTLY TO CONTRACT
 */
contract LOCKED_IN {
    address public immutable MOG = 0xaaeE1A9723aaDB7afA2810263653A34bA2C21C7a;

    mapping(address => uint) public amounts;
    mapping(address => uint) public timestamps;

    event LockedIn(address indexed mogger, uint _amount, uint _duration);
    event LockedOut(address indexed mogger, uint _amount);

    /**
     * @notice PROOF OF LOCKED IN (based cousins only)
     * @param _amount amount to lock in
     */
    function lockIn(uint _amount) external {
        _lockIn(_amount, 2 weeks);
    }

    /**
     * @notice LOCK IN CUSTOM
     * @param _amount amount to lock in
     * @param _duration duration to lock in
     * @dev _duration can be used to reset or reduce lock in period (to minimum 1 day)
     */
    function lockInCustom(uint _amount, uint _duration) external {
        _lockIn(_amount, _duration);
    }

    /**
     * @notice BILLIONS AND TRILLIONS AND KRILLIONS
     */
    function lockOut() external {
        address mogger = msg.sender;
        uint amount = amounts[mogger];
        uint timestamp = timestamps[mogger];
        require(amount != 0 && block.timestamp > timestamp, "BYE BYE");
        delete amounts[mogger];
        IERC20(MOG).transfer(mogger, amount);
        emit LockedOut(mogger, amount);
    }

    function _lockIn(uint _amount, uint _duration) private {
        require(_amount != 0 && _duration >= 1 days, "BYE BYE");
        address mogger = msg.sender;
        amounts[mogger] += _amount;
        timestamps[mogger] = block.timestamp +_duration;
        IERC20(MOG).transferFrom(mogger, address(this), _amount);
        emit LockedIn(mogger, _amount, _duration);
    }
}