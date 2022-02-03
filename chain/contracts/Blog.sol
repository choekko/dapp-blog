// SPDX-License-Identifier: MIT
pragma solidity ^0.7.5;

contract Blog {
  uint public totalPostCount = 0;

  struct Post {
    uint id;
    address owner;
    string title;
    string description;
    uint tipAmount;
  }

  event PostCreated(
    uint id,
    address owner,
    string title,
    string description,
    uint tipAmount
  );

  struct Author {
    address id;
    string nickName;
    uint totalTip;
  }


  mapping (uint => Post) public postList;
  mapping (address => Author ) public authorList; // TODO : 지갑을 연결할 때 Author를 채워야 할듯. 

  // constructor () public {
  // }
  // Author 구조체를 만들고 내 주소를 매핑하는 함수
  function setAuthor(address _sender) public{
    require(authorList[_sender].id != _sender);
    authorList[_sender] = Author(_sender, "test", 0);
  }

  //게시글 읽기 함수
  function getPost (uint _postId) public view returns(Post memory){
    require(
      _postId > 0 && 
      _postId <= totalPostCount &&
      postList[_postId].owner != address(0x0)
    );
    return postList[_postId];
  }
  //게시글 쓰기 함수
  function writePost (string memory _title, string memory _description) public {
    require(bytes(_title).length >0 && bytes(_description).length > 0 );
    totalPostCount ++;
    postList[totalPostCount] = Post(totalPostCount, msg.sender, _title, _description, 0);
    emit PostCreated(totalPostCount, msg.sender, _title, _description, 0);
  }
}
