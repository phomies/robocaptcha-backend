import { gql } from 'apollo-server';

export const DummyTypeDefs = gql`
    scalar Date

    type DocumentDelete {
        calls: Int
        notifications: Int
    }

    extend type Mutation {
        createDummyData(_id: String): Boolean
        deleteDummyData(_id: String): DocumentDelete
    }
`;
