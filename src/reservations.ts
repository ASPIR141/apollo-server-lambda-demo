// https://www.apollographql.com/docs/apollo-server/v1/servers/lambda/

import { ApolloServer, makeExecutableSchema } from 'apollo-server-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

import typeDefs from './typeDefs';
import resolvers from './resolvers';
import { createDynamoDBProvider } from './factories/dynamoDBProviderFactory';

const dynamo = createDynamoDBProvider();

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const server = new ApolloServer({
    schema,
    formatError: error => {
        // console.log(error);
        return error;
    },
    formatResponse: response => {
        // console.log(response);
        return response;
    },
    context: ({ event, context }) => ({
        headers: event.headers,
        functionName: context.functionName,
        event,
        context,
        dynamo
    }),
    playground: true
});

export const handler = server.createHandler({
    cors: {
        origin: '*'
    },
    // onHealthCheck: (req: APIGatewayProxyEvent) => {}
});
