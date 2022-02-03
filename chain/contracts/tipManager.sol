// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

import "./Blog.sol";
contract TipManager is Blog {
    // input으로 글의 id를 받아서, 글의 tip 개수를 늘린다.
    // 글의 작가의 팁 개수도 늘린다.
    event TipGranted(
        uint tip,
        string title,
        address sender,
        address payable receiver,
        address getter,
        uint tipAmount,
        address tipContract
    );
    // TODO :  함수에 payable 넣는 버전과 parameter로 tip을 받는 버전 비교
    function giveTip(uint _postId, address payable _to) public payable{
        Post storage post = postList[_postId];
        post.tipAmount = post.tipAmount + msg.value;
        Author storage author = authorList[post.owner];
        address payable receiver = payable(author.id);
        _to.transfer(msg.value);
        author.totalTip = author.totalTip + msg.value;
        authorList[post.owner] = author;
        postList[_postId] = post;
        emit TipGranted(msg.value, post.title, post.owner, receiver, msg.sender, post.tipAmount, address(this));
    }   
}