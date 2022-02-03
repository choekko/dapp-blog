const { assert } = require('chai');

const TipManager = artifacts.require("TipManager")

require('chai')
  .use(require('chai-as-promised'))
  .should()
contract("Blog", ([owner, receiver, tipper]) => {
  let blogInstance
  let tipManagerInstance

  before(async () => {
    blogInstance = await Blog.deployed();
    tipManagerInstance = await TipManager.deployed();
  });


  it("check valid postID", async () => {
    let title = "title"
    let content = "content"
    result = await blogInstance.writePost(title, content, {from : receiver});
    const postCreated = result.logs[0].args
    assert.equal(postCreated.id.toNumber(), 1, 'id is correct')
    assert.equal(postCreated.title, title, 'Title is correct')
    assert.equal(postCreated.description, content, 'description is correct')
    assert.equal(postCreated.tipAmount, '0', 'tip amount is correct')
    assert.equal(postCreated.owner, receiver, 'author is correct')
  });
  it("success to get post", async () => {
    var postNumber = 1;
    const post = await blogInstance.getPost(postNumber);
    assert.equal(post.id.toNumber(), 1);
    assert.equal(post.title, "title");
    assert.equal(post.description, "content");
    
    assert.equal(post.owner, receiver);
    assert.equal(post.tipAmount.toNumber(), '0');

    await blogInstance.getPost(3).should.be.rejected;
  })
  it("tipmanager succeed to give tip of post#1.", async () => {
    //value에 1만 넣는거랑 towei로 쓰는 버전
      await blogInstance.setAuthor(receiver);
      console.log("receiver : ", receiver);
      console.log("blog contract addr : ", blogInstance.address);
      await tipManagerInstance.giveTip(1, blogInstance.address,{from : owner, value : web3.utils.toWei('2', 'Ether')});
      const post = await blogInstance.getPost(1);
      console.log("post tip amount :", post.tipAmount.toNumber());
  })
});
