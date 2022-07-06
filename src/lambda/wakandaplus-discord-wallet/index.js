const { ethers } = require('ethers');
const { addEvmCoinbaseToUser, putUser } = require('./apis/user.js');
const { createClient } = require('redis');
const Snowflake = require('./libs/snowflake');

const redisClient = new createClient({
	url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

const sfClient = new Snowflake(1, 0);

exports.handler = async (event) => {
	try {
		await redisClient.connect();
	} catch (e) {
		console.log(e);
	}

	let body;
	let statusCode = 200;
	const headers = {
		'Content-Type': 'application/json',
	};

	if (event.requestContext.http.method === 'GET') {
		const state = event.queryStringParameters?.state ?? null;
		const user = await redisClient.get(state);
		if (state && user) {
			body = user;
		} else {
			statusCode = 400;
			body = JSON.stringify('No state or state is expired');
		}
	} else if (event.requestContext.http.method === 'POST') {
		const data = JSON.parse(event.body);
		const state = data.state ?? null;
		const message = data.message ?? null;
		const signature = data.signature ?? null;
		const type = data.type ?? null;
		let address;

		console.log('message:', message);
		console.log('signature:', signature);

		const user = JSON.parse(await redisClient.get(state));
		if (user['member']) {
			if (signature && type === 'EVM') {
				const r = signature.slice(0, 66);
				const s = '0x' + signature.slice(66, 130);
				const v = parseInt('0x' + signature.slice(130, 132), 16);
				try {
					address = ethers.utils.verifyMessage(message, {
						r: r,
						s: s,
						v: v,
					});
					body = JSON.stringify({
						address: address,
					});
					try {
						const id = await redisClient.get(
							`${user['member']}-${user['guild'] ?? 0}`
						);
						await addEvmCoinbaseToUser(id, new Set([address]));
					} catch (e) {
						const id = sfClient.nextId();
						redisClient.set(
							`${user['member']}-${user['guild'] ?? 0}`,
							id.toString()
						);
						await putUser(id, user['member'], user['guild'] ?? 0);
						await addEvmCoinbaseToUser(id, new Set([address]));
					}
				} catch (e) {
					statusCode = 400;
					body = JSON.stringify({
						msg: e.message,
					});
				}
			}
		} else {
			statusCode = 400;
			body = JSON.stringify({
				msg: 'This state is expired, please try again in bot.',
			});
		}
	} else {
		statusCode = 400;
		body = JSON.stringify({
			msg: 'Only support GET and POST',
		});
	}

	await redisClient.disconnect();

	return {
		statusCode,
		body,
		headers,
	};
};
