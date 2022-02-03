// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./Blog.sol";
contract TipManager is Blog {
    // input으로 글의 id를 받아서, 글의 tip 개수를 늘린다.
    // 글의 작가의 팁 개수도 늘린다.
    function giveTip(uint _postId) public {
        Post storage post = postList[_postId];
        post.tipAmount ++;
        Author storage author = authorList[post.owner];
        author.totalTip ++;
    }   
}