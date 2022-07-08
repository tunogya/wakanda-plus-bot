const { ethers } = require('ethers');
const { createClient } = require('redis');
const { Snowflake } = require('nodejs-snowflake');
const { UpdateCommand, PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const fcl = require('@onflow/fcl');

fcl.config({
	'accessNode.api': 'https://rest-testnet.onflow.org',
	"app.detail.title": "Wakanda+",
	"app.detail.icon": "https://wakandaplus.wakanda.cn/logo512.png",
	'flow.network': 'testnet',
	"discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
	"discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/testnet/authn",
});

const ddbClient = new DynamoDBClient({
	region: 'ap-northeast-1',
});

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

const uid = new Snowflake({
	custom_epoch: 1656604800000,
	instance_id: 1,
});

const redisClient = new createClient({
	url: process.env.REDIS_URL,
});

redisClient
	.on('error', (err) => console.log('Redis Client Error', err));

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
	const data = JSON.parse(event.body);
	const state = data.state ?? undefined;
	const signature = data.signature ?? undefined;
	const type = data.type ?? undefined;
	
	const content = JSON.parse(await redisClient.get(state));
	const message = content['message'] ?? undefined;
	let address;
	
	if (content['user'] && signature && type && message) {
		if (type === 'EVM') {
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
			} catch (e) {
				statusCode = 400;
				body = JSON.stringify({
					msg: e.message,
				});
			}
		}
		else if (type === 'FLOW') {
			const isValid = await fcl.AppUtils.verifyUserSignatures(Buffer.from(message).toString('hex'), signature);
			if (isValid) {
				address = signature[0].addr;
				body = JSON.stringify({
					address: address,
				});
			}
			else {
				// statusCode = 400;
				body = JSON.stringify({
					msg: 'Invalid signature',
				});
			}
		}
		
		if (address) {
			try {
				const id = await redisClient.get(content['user']);
				
				const params = {
					TableName: 'wakandaplus',
					Key: {
						id: BigInt(id),
					},
					ExpressionAttributeNames: { '#wallets': 'wallets' },
					UpdateExpression: 'ADD #wallets :wallets',
					ExpressionAttributeValues: {
						':wallets': new Set([address]),
					},
				};
				try {
					await ddbDocClient.send(new UpdateCommand(params));
				} catch (err) {
					console.log('Error:', err);
				}
			} catch (e) {
				const id = uid.getUniqueID();
				await redisClient.set(
					content['user'],
					id.toString(),
				);
				const params = {
					TableName: 'wakandaplus',
					Item: {
						id: BigInt(id),
						user: BigInt(content['user']),
						wallets: new Set([address]),
					},
				};
				
				try {
					await ddbDocClient.send(new PutCommand(params));
				} catch (err) {
					console.log('Error', err.stack);
				}
			}
		}
	}
	else {
		statusCode = 400;
		body = JSON.stringify({
			msg: 'Need: state, signature, type. And state only can be live in 5 min.',
		});
	}
	
	await redisClient.disconnect();
	
	return {
		statusCode,
		body,
		headers,
	};
};
