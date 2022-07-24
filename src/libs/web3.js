const { ethers } = require("ethers");
const INFURA_NETWORK_URLS = require("../constant/infura");
const SupportedChainId = require("../constant/chains");
const dotenv = require("dotenv");
dotenv.config();

const mnemonic = process.env.MNEMONIC

const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)

const MainnetProvider = new ethers.providers.JsonRpcProvider(INFURA_NETWORK_URLS[SupportedChainId.MAINNET]);
const PolygonProvider = new ethers.providers.JsonRpcProvider(INFURA_NETWORK_URLS[SupportedChainId.POLYGON]);
const GoerliProvider = new ethers.providers.JsonRpcProvider(INFURA_NETWORK_URLS[SupportedChainId.GOERLI]);

const MainnetProviderWithSinger = walletMnemonic.connect(MainnetProvider)
const PolygonProviderWithSinger = walletMnemonic.connect(PolygonProvider)
const GerliProviderWithSinger = walletMnemonic.connect(GoerliProvider)

module.exports = {
	MainnetProvider,
	PolygonProvider,
	GoerliProvider,
	MainnetProviderWithSinger,
	PolygonProviderWithSinger,
	GerliProviderWithSinger,
}

