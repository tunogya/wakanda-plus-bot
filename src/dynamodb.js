const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'ap-northeast-1' })

module.exports = dynamo;
