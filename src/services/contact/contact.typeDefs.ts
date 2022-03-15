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

    input ContactInput {
        _id: ID!
        name: String
        number: String
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
        updateContact(contactInput: ContactInput): Contact
    }
`;
