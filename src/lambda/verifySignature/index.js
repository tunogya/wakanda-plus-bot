const { ethers } = require('ethers');
const { createClient } = require('redis');
const { Snowflake } = require('nodejs-snowflake');
const { UpdateCommand, PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

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
	const state = data.state ?? null;
	const signature = data.signature ?? null;
	const type = data.type ?? null;
	
	const content = JSON.parse(await redisClient.get(state));
	const message = content['message'] ?? '';
	let address;
	
	if (content['user']) {
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
					const id = await redisClient.get(content['user']);
					
					const params = {
						TableName: 'wakandaplus',
						Key: {
							id: BigInt(id),
						},
						ExpressionAttributeNames: { '#wallet': 'wallet' },
						UpdateExpression: 'ADD #wallet :w',
						ExpressionAttributeValues: {
							':w': new Set([address]),
						},
					};
					try {
						await ddbDocClient.send(new UpdateCommand(params));
						console.log('Success - item added or updated:\n');
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
						console.log('Success - item added or updated:\n');
					} catch (err) {
						console.log('Error', err.stack);
					}
				}
			} catch (e) {
				statusCode = 400;
				body = JSON.stringify({
					msg: e.message,
				});
			}
		}
	}
	else {
		statusCode = 400;
		body = JSON.stringify({
			msg: 'This state is expired, please try again in bot.',
		});
	}
	
	await redisClient.disconnect();
	
	return {
		statusCode,
		body,
		headers,
	};
};
