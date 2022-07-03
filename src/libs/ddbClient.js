const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');

const ddbClient = new DynamoDBClient({
	region: 'ap-northeast-1',
});

module.exports = ddbClient;
