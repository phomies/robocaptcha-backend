import { gql } from 'apollo-server';

export const UserTypeDefs = gql`
    scalar Date

    type User @key(fields: "_id") {
        _id: String
        name: String
        password: String
        email: String
        phoneNumber: String
        maskedNumber: String
        dateJoined: Date
        verificationLevel: Int
        permissions: [String]
    }

    input UserInput {
        name: String
        email: String
        phoneNumber: String
        maskedNumber: String
        verificationLevel: Int
    }

    extend type Query {
        getAllUsers: [User]
        getUser: User
        loginUser(token: String): String
    }

    extend type Mutation {
        updateUser(userInput: UserInput): User
        deleteUser: Boolean
    }
`;
