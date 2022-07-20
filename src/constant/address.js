const SupportedChainId = require('./chains')

const WAKANDAPASS_ADDRESS = {
	[SupportedChainId.MAINNET]: '',
	[SupportedChainId.RINKEBY]: '0x863a31036c9cd2d82da29eb34Ba4422C3B2FF51F',
	[SupportedChainId.POLYGON]: '',
	[SupportedChainId.POLYGON_MUMBAI]: '0x188cE78bcE46C958Bb287e0A57f5B68C4cC9632a',
	[SupportedChainId.GOERLI]: '0xc0166C4F87892ac435444730144C949Acd3F642D',
}

module.exports = {
	WAKANDAPASS_ADDRESS,
}

