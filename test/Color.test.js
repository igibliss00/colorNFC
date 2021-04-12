const { assert } = require('chai');
const { FormControlStatic } = require('react-bootstrap')

const Color = artifacts.require('./Color.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract("Color", (accounts) => {
  let contract;

  before(async () => {
    contract = await Color.deployed();
  })

  describe("deployment", async() => {
    it("deployed successfully", async () => {
      let address = contract.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })
  })

  describe("minting", async() => {
    it("create a new token", async () => {
      const result = await contract.mint("#EC058E");
      const totalSupply = await contract.totalSupply();

      assert.equal(totalSupply, 1);

      const event = result.logs[0].args;
      assert.equal(event.tokenId.toNumber(), 1, "id is correct")
      assert.equal(event.to, accounts[0], "to is incorrect");

      await contract.mint("#EC058E").should.be.rejected;
    })
  })

  describe("indexing", async() => {
    it("lists colors", async() => {
      await contract.mint("#5386E4");
      await contract.mint("#FFFFFF");
      await contract.mint("#000000");
      const totalSupply = await contract.totalSupply();

      let color;
      let result = [];

      for (var i = 1; i < totalSupply; i++) {
        color = await contract.colors(i);
        result.push(color)
      }

      let expected = ["#5386E4", "#FFFFFF", "#000000"];
      assert.equal(result.join(","), expected.join(","))
    })
  })
})