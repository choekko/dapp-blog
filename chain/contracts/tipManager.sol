// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./Blog.sol";
contract TipManager is Blog {
    // input으로 글의 id를 받아서, 글의 tip 개수를 늘린다.
    // 글의 작가의 팁 개수도 늘린다.
    event TipGranted(
        uint tip,
        uint postid,
        address owner,
        address payable receiver,
        uint balance,
        uint tipAmount
    );
    // TODO :  함수에 payable 넣는 버전과 parameter로 tip을 받는 버전 비교
    function giveTip(uint _postId) public payable{
        Post storage post = postList[_postId];
        post.tipAmount = post.tipAmount + msg.value;
        Author storage author = authorList[post.owner];
        address payable receiver = payable(post.owner);
        receiver.transfer(msg.value);
        author.totalTip = author.totalTip + msg.value;
        authorList[post.owner] = author;
        emit TipGranted(msg.value, _postId, post.owner, receiver, address(this).balance, post.tipAmount);
    }   
}