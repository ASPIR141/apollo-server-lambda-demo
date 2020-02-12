import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export enum ComparisonOperators {
    GT = '>',
    LT = '<',
    GTE = '>=',
    LTE = '<=',
    EQ = '=',
    NE = '<>'
}

interface QueryDocumentInterface {
    [key: string]: {
        [operator: string]: any
    }
}

interface UpdateDocumentInterface {
    [keyword: string]: {
        [key: string]: any
    }
}

export class DynamoDBProvider {
    constructor(
        private readonly documentClient: DocumentClient
    ) { }

    private getKeyConditionExpression(query: QueryDocumentInterface) {
        const keyConditionExpression = Object.keys(query)
            .map(key => {
                const operator = Object.keys(query[key])[0];
                return `${key} ${operator} :${key}`
            })
            .sort()
            .join(' and ');

        return keyConditionExpression;
    }

    private getUpdateExpression(update: UpdateDocumentInterface) {
        const updateOperator = Object.keys(update)[0];
        const replacementDocument = update[updateOperator];

        const actions = Object.keys(replacementDocument)
            .map(key => `${key} = :${key}`)
            .join(', ');

        return `${updateOperator} ${actions}`;
    }

    private getExpressionAttributeValues(document: QueryDocumentInterface | UpdateDocumentInterface, _keyFirst: boolean = true) {
        const expressionAttributeValues = {};
        for (const [key, object] of Object.entries(document)) {
            const value = Object.values(object)[0];
            if (_keyFirst) {
                expressionAttributeValues[`:${key}`] = value;
            } else {
                Object.keys(object).forEach(key => expressionAttributeValues[`:${key}`] = object[key]);
            }
        }

        return expressionAttributeValues;
    }

    /**
     * To read items, pass the query object as follows:
     * { partitionKey: { operator: value }}
     */
    public async find(tableName: string, query: QueryDocumentInterface, options?: { limit?: number }) {
        const params: DocumentClient.QueryInput = {
            TableName: tableName,
            KeyConditionExpression: this.getKeyConditionExpression(query),
            ExpressionAttributeValues: this.getExpressionAttributeValues(query),
        };

        if (options) {
            params.Limit = options.limit;
        }

        return await this.documentClient.query(params).promise();
    }

    public async scan(tableName: string) {
        const params: DocumentClient.ScanInput = {
            TableName: tableName
        };

        return await this.documentClient.scan(params).promise();
    }

    public async insert(tableName: string, item: { [key: string]: any }) {
        const params: DocumentClient.PutItemInput = {
            TableName: tableName,
            Item: item
        };

        return await this.documentClient.put(params).promise();
    }

    public async delete(tableName: string, query: { [key: string]: any }) {
        const params: DocumentClient.DeleteItemInput = {
            TableName: tableName,
            Key: query,
        };

        return await this.documentClient.delete(params).promise();
    }

    /**
     * To update an existing item's attributes, pass the update object as follows:
     * { 'set | 'remove' | 'add' | 'delete': { field1: value1, field2: value2 }}
     **/
    public async update(tableName: string, query: { [key: string]: any }, update: UpdateDocumentInterface) {
        const params: DocumentClient.UpdateItemInput = {
            TableName: tableName,
            Key: query,
            ReturnValues: 'ALL_NEW',
            UpdateExpression: this.getUpdateExpression(update),
            ExpressionAttributeValues: this.getExpressionAttributeValues(update, false)
        };

        return await this.documentClient.update(params).promise();
    }
}