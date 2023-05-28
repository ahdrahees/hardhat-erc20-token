const { ethers } = require("hardhat")

const networkConfig = {
  31337: {
    name: "localhost",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  },
}
const INITIAL_SUPPLY = "1000000000000000000000000"
// const INITIAL_SUPPLY = ethers.utils.parseEther("1000000.0")

const INITIAL_SUPPLY_MANUAL = "1000000000" // 1B. already implemented decimal in contract

const developmentChains = ["hardhat", "localhost"]

module.exports = {
  networkConfig,
  developmentChains,
  INITIAL_SUPPLY,
  INITIAL_SUPPLY_MANUAL,
}
