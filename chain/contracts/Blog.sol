// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

contract Blog {
  uint public totalPostCount = 4;

  struct Post {
    uint id;
    address owner;
    string title;
    string description;
    uint tipAmount;
  }

  struct Author {
    string nickName;
  }

  mapping (uint => Post) public postList;
  mapping (address => Author ) public authorList ;

  // constructor () public {
  // }

  //게시글 읽기 함수
  function getPost (uint _postId) public {
    require(
      _postId > 0 && 
      _postId <= totalPostCount &&
      postList[_postId].owner != address(0x0)
    , 'invalid postId');
  }

  //게시글 쓰기 함수

  uint storedData;

  function set(uint x) public {
    storedData = x;
  }

  function get() public view returns (uint) {
    return storedData;
  }
}
