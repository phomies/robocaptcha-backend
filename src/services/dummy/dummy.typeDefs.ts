import { gql } from 'apollo-server';

export const DummyTypeDefs = gql`
    scalar Date

    type DocumentSummary {
        calls: Int
        notifications: Int
        contacts: Int
    }

    extend type Mutation {
        createDummyData(_id: String): DocumentSummary
        deleteDummyData(_id: String): DocumentSummary
    }
`;
