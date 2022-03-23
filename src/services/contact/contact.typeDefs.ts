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

    input CreateContactInput {
        name: String
        number: String
        isWhitelisted: Boolean
        isBlacklisted: Boolean
    }

    input UpdateContactInput {
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
        createContact(createContactInput: CreateContactInput): Boolean
        updateContact(updateContactInput: UpdateContactInput): Contact
    }
`;
