const CryptoFunkMarket = artifacts.require("CryptoFunkMarket");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("CryptoFunkMarket", function (/* accounts */) {
  it("should assert true", async function () {
    await CryptoFunkMarket.deployed();
    return assert.isTrue(true);
  });
});
