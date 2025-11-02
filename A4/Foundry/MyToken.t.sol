// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyToken.sol";

contract MyTokenTest is Test {
    MyToken token;
    address admin;
    address user;

    function setUp() public {
        admin = address(this);
        user = address(0x1);
        token = new MyToken("MyToken", "MTK", 1000 * 10 ** 18);
    }

    function testMintByMinter() public {
        token.mint(user, 100 * 10 ** 18);
        assertEq(token.balanceOf(user), 100 * 10 ** 18);
    }

    function testPauseAndUnpause() public {
        token.pause();
        assertTrue(token.paused());
        token.unpause();
        assertFalse(token.paused());
    }
}
