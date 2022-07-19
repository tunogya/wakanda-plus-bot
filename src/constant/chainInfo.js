const SupportedChainId = require('./chains')

const ChainInfo = {
	[SupportedChainId.MAINNET]: {
		docs: 'https://docs.wakanda-labs.com/',
		explorer: 'https://etherscan.io/',
		infoLink: 'https://info.wakanda-labs.com/',
		label: 'Ethereum',
	},
	[SupportedChainId.RINKEBY]: {
		docs: 'https://docs.wakanda-labs.com/',
		explorer: 'https://rinkeby.etherscan.io/',
		infoLink: 'https://info.wakanda-labs.com/',
		label: 'Rinkeby',
	},
	[SupportedChainId.POLYGON]: {
		bridge: 'https://wallet.polygon.technology/bridge',
		docs: 'https://docs.wakanda-labs.com/',
		explorer: 'https://polygonscan.com/',
		infoLink: 'https://info.wakanda-labs.com/',
		label: 'Polygon',
	},
	[SupportedChainId.POLYGON_MUMBAI]: {
		bridge: 'https://wallet.polygon.technology/bridge',
		docs: 'https://docs.wakanda-labs.com/',
		explorer: 'https://mumbai.polygonscan.com/',
		infoLink: 'https://info.wakanda-labs.com/',
		label: 'Polygon Mumbai',
	}
}

module.exports = ChainInfo