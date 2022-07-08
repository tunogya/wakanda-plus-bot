const log = require("../libs/log.js")

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		log.info(`Ready! Logged in as ${client.user.tag}`)
		const channel = client.channels.cache.get('989759769621434418');
		channel.send(`I can help you connect and manage wallets.
You can control me by sending these commands:

*/connectwallet* - connect a new wallet
*/mywallets* - manage your wallets

**Edit Wallets**
*/deletewallet* - delete a wallet

**Role**
*/claimrole* - claim role manually

**Other**
*/cancel* - cancel the current operation`);
	},
};
