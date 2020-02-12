import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { DynamoDBProvider } from '../providers/DynamoDBProvider';

export const createDynamoDBProvider = () => {
    const options = {
        credentials: {
            accessKeyId: '1',
            secretAccessKey: '1'
        },
        endpoint: 'http://127.0.0.1:4569',
        region: 'us-east-1'
    };

    const documentClient = new DocumentClient(options);
    return new DynamoDBProvider(documentClient);
};
