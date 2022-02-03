var TipManager = artifacts.require("TipManager");

module.exports = function(deployer) {
  deployer.deploy(TipManager);
};
