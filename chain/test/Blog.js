const Blog = artifacts.require("./Blog.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()
contract("Blog", accounts => {
  let blogInstance

  before(async () => {
    blogInstance = await Blog.deployed();
  });


  it("check valid postID", async () => {
    await blogInstance.getPost(3).should.be.rejected;

  });
});
