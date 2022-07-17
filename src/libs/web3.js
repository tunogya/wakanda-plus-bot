const { ethers } = require("ethers");

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

const signer = provider.getSigner()

