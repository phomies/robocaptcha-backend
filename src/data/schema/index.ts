import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    scalar Date

    type User {
        id: ID!
        name: String
        password: String
        email: String
        dateJoined: Date
        whitelist: [Int]
        blacklist: [Int]
    }

    input UserInput {
        name: String
        email: String
        password: String
    }

    type Query {
        getAllUsers: [User]
    }

    type Mutation {
        createUser(payload: UserInput): User
    }
`;
