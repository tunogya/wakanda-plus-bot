const SupportedChainId = require('./chains')
const INFURA_KEY = process.env.INFURA_KEY
if (typeof INFURA_KEY === 'undefined') {
	throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
const INFURA_NETWORK_URLS = {
	[SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.OPTIMISM]: `https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.OPTIMISTIC_KOVAN]: `https://optimism-kovan.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.ARBITRUM_ONE]: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.ARBITRUM_RINKEBY]: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.POLYGON]: `https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`,
	[SupportedChainId.POLYGON_MUMBAI]: `https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`,
}

module.exports = INFURA_NETWORK_URLS
