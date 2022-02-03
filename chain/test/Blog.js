const Blog = artifacts.require("./Blog.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()
contract("Blog", ([deployer, owner, accounts]) => {
  let blogInstance

  before(async () => {
    blogInstance = await Blog.deployed();
  });


  it("check valid postID", async () => {
    let title = "title"
    let content = "content"
    result = await blogInstance.writePost(title, content);
    const postCreated = result.logs[0].arg
    
    assert.equal(postCreated.id.toNumber(), imageCount.toNumber(), 'id is correct')
    assert.equal(postCreated.title, title, 'Title is correct')
    assert.equal(postCreated.description, description, 'content is correct')
    assert.equal(postCreated.tipAmount, '0', 'tip amount is correct')
    assert.equal(postCreated.owner, owner, 'author is correct')
    await blogInstance.getPost(3).should.be.rejected;
  });
});
