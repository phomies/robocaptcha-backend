import { gql } from 'apollo-server';

export const ContactTypeDefs = gql`
    scalar Date

    type Contact {
        _id: ID
        name: String
        number: String
        isBlocked: Boolean
        createdAt: Date
        updatedAt: Date
    }

    extend type User @key(fields: "_id") {
        _id: String @external
        contacts: [Contact]
    }

    extend type Query {
        syncContacts: Boolean
    }
`;
