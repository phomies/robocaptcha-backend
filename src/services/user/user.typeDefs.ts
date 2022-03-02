import { gql } from 'apollo-server';

export const UserTypeDefs = gql`
    scalar Date

    type User @key(fields: "_id") {
        _id: ID
        name: String
        password: String
        email: String
        phoneNumber: String
        maskedNumber: String
        dateJoined: Date
        whitelist: [Int]
        blacklist: [Int]
        verificationLevel: Int
    }

    input UserInput {
        _id: ID!
        name: String
        email: String
        phoneNumber: String
        maskedNumber: String
        whitelist: [Int]
        blacklist: [Int]
        verificationLevel: Int
    }

    extend type Query {
        getAllUsers: [User]
        getUser(id: ID): User
    }

    extend type Mutation {
        updateUser(userInput: UserInput): User
        deleteUser(id: ID): Boolean
    }
`;
