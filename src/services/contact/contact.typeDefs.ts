import { gql } from 'apollo-server';

export const ContactTypeDefs = gql`
    scalar Date

    type Contact {
        name: String
        phoneNumber: String
    }

    extend type Query {
        getContacts: [Contact]
        syncContacts: Boolean
    }
`;
