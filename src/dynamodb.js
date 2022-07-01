const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient({
	region: 'ap-northeast-1',
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

module.exports = dynamo;
