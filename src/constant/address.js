const SupportedChainId = require('./chains')

const WAKANDAPASS_ADDRESS = {
	[SupportedChainId.MAINNET]: '',
	[SupportedChainId.RINKEBY]: '0x863a31036c9cd2d82da29eb34Ba4422C3B2FF51F',
	[SupportedChainId.POLYGON]: '',
	[SupportedChainId.POLYGON_MUMBAI]: '',
}

module.exports = {
	WAKANDAPASS_ADDRESS,
}

