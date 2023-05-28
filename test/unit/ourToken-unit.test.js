const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const {
  developmentChains,
  INITIAL_SUPPLY_MANUAL,
} = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("TokenERC20 Unit Test", function () {
      //Multipler is used to make reading the math easier because of the 18 decimal points
      const multiplier = 10 ** 18
      let TokenERC20, deployer, user1
      beforeEach(async function () {
        const accounts = await getNamedAccounts()
        deployer = accounts.deployer
        user1 = accounts.user1

        await deployments.fixture("all")
        TokenERC20 = await ethers.getContractAt("TokenERC20", deployer)
      })
      it("was deployed", async () => {
        assert(TokenERC20.address)
      })
      describe("constructor", () => {
        it("Should have correct INITIAL_SUPPLY of token", async () => {
          const totalSupply = await TokenERC20.totalSupply

          assert.equal(
            totalSupply.toString(),
            (INITIAL_SUPPLY_MANUAL * 10 ** 18).toString()
          )
        })
        it("initializes the token with the correct name and symbol", async () => {
          const name = (await TokenERC20.name).toString()
          assert.equal(name, "Kerala")

          const symbol = (await TokenERC20.symbol).toString()
          assert.equal(symbol, "KL")
        })
      })
      describe("transfers", () => {
        it("Should be able to transfer tokens successfully to an address", async () => {
          const tokensToSend = ethers.utils.parseEther("10")
          await TokenERC20.transfer(user1, tokensToSend)
          expect(await TokenERC20.balanceOf(user1)).to.equal(tokensToSend)
        })
        it("emits an transfer event, when an transfer occurs", async () => {
          await expect(
            TokenERC20.transfer(user1, (10 * multiplier).toString())
          ).to.emit(TokenERC20, "Transfer")
        })
      })
      describe("allowances", () => {
        const amount = (20 * multiplier).toString()
        beforeEach(async () => {
          playerToken = await ethers.getContractAt("TokenERC20", user1)
        })
        it("Should approve other address to spend token", async () => {
          const tokensToSpend = ethers.utils.parseEther("5")
          //Deployer is approving that user1 can spend 5 of their precious KL's token
          await TokenERC20.approve(user1, tokensToSpend)
          await playerToken.transferFrom(deployer, user1, tokensToSpend)
          expect(await playerToken.balanceOf(user1)).to.equal(tokensToSpend)
        })
        it("doesn't allow an unapproved member to do transfers", async () => {
          await expect(playerToken.transferFrom(deployer, user1, amount)).to.be
            .reverted
        })
        it("emits an approval event, when an approval occurs", async () => {
          await expect(TokenERC20.approve(user1, amount)).to.emit(
            TokenERC20,
            "Approval"
          )
        })
        it("the allowance being set is accurate", async () => {
          await TokenERC20.approve(user1, amount)
          const allowance = await TokenERC20.allowance(deployer, user1)
          assert.equal(allowance.toString(), amount)
        })
        it("won't allow a user to go over the allowance", async () => {
          await TokenERC20.approve(user1, amount)
          await expect(
            playerToken.transferFrom(
              deployer,
              user1,
              (40 * multiplier).toString()
            )
          ).to.be.revertedWith("ERC20: insufficient allowance")
        })
      })
    })
