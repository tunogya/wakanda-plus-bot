const { ethers } = require("ethers");
const INFURA_NETWORK_URLS = require("../constant/infura");
const SupportedChainId = require("../constant/chains");
const dotenv = require("dotenv");
dotenv.config();

const mnemonic = process.env.MNEMONIC

const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)

const MainnetProvider = new ethers.providers.JsonRpcProvider(INFURA_NETWORK_URLS[SupportedChainId.MAINNET]);
const RinkebyProvider = new ethers.providers.JsonRpcProvider(INFURA_NETWORK_URLS[SupportedChainId.RINKEBY]);
const PolygonProvider = new ethers.providers.JsonRpcProvider(INFURA_NETWORK_URLS[SupportedChainId.POLYGON]);
const MumbaiProvider = new ethers.providers.JsonRpcProvider(INFURA_NETWORK_URLS[SupportedChainId.POLYGON_MUMBAI]);

const MainnetProviderWithSinger = walletMnemonic.connect(MainnetProvider)
const RinkebyProviderWithSinger = walletMnemonic.connect(RinkebyProvider)
const PolygonProviderWithSinger = walletMnemonic.connect(PolygonProvider)
const MumbaiProviderWithSinger = walletMnemonic.connect(MumbaiProvider)

module.exports = {
	MainnetProvider,
	RinkebyProvider,
	PolygonProvider,
	MumbaiProvider,
	MainnetProviderWithSinger,
	RinkebyProviderWithSinger,
	PolygonProviderWithSinger,
	MumbaiProviderWithSinger,
}

