const { ethers } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();

const INFURA_KEY = process.env.INFURA_KEY
const mnemonic = process.env.MNEMONIC

const walletMnemonic = ethers.Wallet.fromMnemonic(mnemonic)

const MainnetProvider = new ethers.providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_KEY}`);
const RinkebyProvider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${INFURA_KEY}`);
const PolygonProvider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`);
const MumbaiProvider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`);

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

