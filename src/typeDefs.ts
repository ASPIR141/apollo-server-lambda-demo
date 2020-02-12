import { gql } from 'apollo-server-lambda';

const typeDefs = gql`
  type Query {
    reservations: [Reservation]!
    reservation(id: Int!): Reservation
  }

  type Mutation {
    createReservation(id: Int!, reservationDate: String!, status: String): Reservation
  }

  type Reservation {
    id: Int!
    reservationDate: String!
    status: String
  }
`;

export default typeDefs;
