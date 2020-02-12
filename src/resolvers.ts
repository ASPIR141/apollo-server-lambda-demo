import { DynamoDBProvider, ComparisonOperators } from './providers/DynamoDBProvider';

const resolvers = {
    Query: {
        reservations: async (_, _args, { dynamo }: { dynamo: DynamoDBProvider }) => {
            const { Items } = await dynamo.scan(process.env.RESERVATIONS_TABLE_NAME);
            return Items;
        },
        reservation: async (_, { id }, { dynamo }: { dynamo: DynamoDBProvider }) => {
            const { Items } = await dynamo.find(process.env.RESERVATIONS_TABLE_NAME, {
                id: { [ComparisonOperators.EQ]: id }
            });

            return Items[0];
        },
    },
    Mutation: {
        createReservation: async (
            _,
            { id, reservationDate, status },
            { dynamo }: { dynamo: DynamoDBProvider }
        ) => {
            await dynamo.insert(process.env.RESERVATIONS_TABLE_NAME, {
                id,
                reservationDate,
                status
            });

            return { id, reservationDate, status };
        }
    }
};

export default resolvers;
