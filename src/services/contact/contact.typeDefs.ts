import { gql } from 'apollo-server';

export const ContactTypeDefs = gql`
    scalar Date

    type Contact {
        _id: ID
        name: String
        number: String
        isWhitelisted: Boolean
        isBlacklisted: Boolean
        userId: String
        createdAt: Date
        updatedAt: Date
    }

    input UpsertContactInput {
        number: String!
        name: String
        isWhitelisted: Boolean
        isBlacklisted: Boolean
    }

    extend type User @key(fields: "_id") {
        _id: String @external
        contacts: [Contact]
    }

    extend type Query {
        syncContacts: Boolean
    }

    extend type Mutation {
        upsertContact(upsertContactInput: UpsertContactInput): Contact
    }
`;
