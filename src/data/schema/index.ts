import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    scalar Date

    type User {
        id: ID!,
        name: String,
        password: String,
        email: String,
        dateJoined: Date,
        whitelist: [Int],
        blacklist: [Int],
    }

    type Query {
        getAllUsers: [User]
    }
`;
