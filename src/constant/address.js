const SupportedChainId = require('./chains')

const WAKANDAPASS_ADDRESS = {
	[SupportedChainId.MAINNET]: '',
	[SupportedChainId.RINKEBY]: '0xf51c774f35f0FEafc75f9fCaE71d9B7a1625686A',
	[SupportedChainId.POLYGON]: '',
	[SupportedChainId.POLYGON_MUMBAI]: '',
}

module.exports = {
	WAKANDAPASS_ADDRESS,
}

