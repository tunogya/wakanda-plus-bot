const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const ddbClient = require('./ddbClient.js');

const marshallOptions = {
	convertEmptyValues: true,
	removeUndefinedValues: true,
	convertClassInstanceToMap: true,
};

const unmarshallOptions = {
	wrapNumbers: false,
};

const translateConfig = { marshallOptions, unmarshallOptions };

const ddbDocClient = DynamoDBDocumentClient.from(ddbClient, translateConfig);

module.exports = ddbDocClient;