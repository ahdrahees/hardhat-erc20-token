const { network } = require("hardhat")
const {
  developmentChains,
  INITIAL_SUPPLY_MANUAL,
} = require("../helper-hardhat-config")
const { verify } = require("../helper-functions")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const args = [INITIAL_SUPPLY_MANUAL, "Kerala", "KL"]
  log(
    "\n=====================================================================================\n"
  )

  const TokenERC20 = await deploy("TokenERC20", {
    from: deployer,
    args: args,
    log: true,
    // we need to wait if on a live network so we can verify properly
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  log(`ourToken deployed at ${TokenERC20.address}`)

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(TokenERC20.address, args)
  }
}

module.exports.tags = ["all", "token"]
