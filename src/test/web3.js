const {RinkebyProvider, RinkebyProviderWithSinger} = require('../libs/web3.js')
const ethers = require('ethers')
const { WAKANDAPASS_ADDRESS } = require('../constant/address.js')
const SupportedChainId = require('../constant/chains')
const geohash_abi = require('../abis/geohash.json')

const fetch = async () => {
	const passContract = new ethers.Contract(WAKANDAPASS_ADDRESS[SupportedChainId.RINKEBY], geohash_abi, RinkebyProvider)
	// // console.log(await passContract.name())
	// // console.log(await passContract.symbol())
	console.log((await passContract.balanceOf('0x3B00ce7E2d0E0E905990f9B09A1F515C71a91C10')).toNumber())
	// console.log(await RinkebyProviderWithSinger.getAddress())
	
}

fetch()
