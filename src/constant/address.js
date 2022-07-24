const SupportedChainId = require('./chains')

const WAKANDAPASS_ADDRESS = {
	[SupportedChainId.MAINNET]: '',
	[SupportedChainId.RINKEBY]: '0xbEf929f1374138035cc86BFe03090c3bb74fF917',
	[SupportedChainId.POLYGON]: '',
	[SupportedChainId.POLYGON_MUMBAI]: '0x049bAA72323d1b455Ac38AA09158D140cba6baf3',
	[SupportedChainId.GOERLI]: '0x39EfBfAa12d95082a927b55951565656848F1515',
}

module.exports = {
	WAKANDAPASS_ADDRESS,
}

