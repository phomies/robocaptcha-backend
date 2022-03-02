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
        permissions: [String]
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
        getUser(_id: ID): User
        loginUser(_id: ID, token: String): String
    }

    extend type Mutation {
        updateUser(userInput: UserInput): User
        deleteUser(_id: ID): Boolean
    }
`;
