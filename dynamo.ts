import { DynamoDB } from 'aws-sdk';

const options = {
    credentials: {
        accessKeyId: '1',
        secretAccessKey: '1',
    },
    endpoint: 'http://127.0.0.1:4569',
    region: 'us-east-1'
};

const TABLE_NAME = 'Reservations';
const db = new DynamoDB(options);
const params: DynamoDB.CreateTableInput = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'N'
        }
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH'
        }
    ],
    TableName: TABLE_NAME,
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

db.createTable(params, (err, data) => {
    if (err) {
        console.log(err);
    };

    console.log(data);
});
