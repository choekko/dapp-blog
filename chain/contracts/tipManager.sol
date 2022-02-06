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
    function giveTip(uint _postId) public payable{
        Post storage post = postList[_postId];
        post.tipAmount = post.tipAmount + msg.value;

        address payable receiver = post.owner;

        //돈이 이상한데로 전송된다...
        receiver.transfer(msg.value);

        Author storage author = authorList[post.owner];
        author.totalTip = author.totalTip + msg.value;
        
        emit TipGranted(msg.value, post.title, post.owner, receiver, msg.sender, post.tipAmount, address(this));
    }   
}