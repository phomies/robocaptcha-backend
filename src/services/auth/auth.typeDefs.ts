import { gql } from 'apollo-server';

export const AuthTypeDefs = gql`
    extend type User @key(fields: "_id") {
        _id: ID @external
        permissions: [String] @external
    }

    extend type Query {
        login(_id: ID, token: String): String
    }
`;
