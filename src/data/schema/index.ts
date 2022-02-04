import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    scalar Date

    type User {
        _id: ID
        name: String
        password: String
        email: String
        dateJoined: Date
        whitelist: [Int]
        blacklist: [Int]
    }

    input NewUserInput {
        name: String!
        email: String!
        password: String!
    }

    input UserInput {
        _id: ID!
        name: String
        password: String
        email: String
        whitelist: [Int]
        blacklist: [Int]
    }

    type Query {
        getAllUsers: [User]
    }

    type Mutation {
        createUser(userInput: NewUserInput): User
        updateUser(userInput: UserInput): User
        deleteUser(id: ID): Boolean
    }
`;
