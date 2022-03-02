import { gql } from 'apollo-server';

export const PaymentTypeDefs = gql`
    scalar Date

    type Payment @key(fields: "_id") {
        _id: ID
        userId: ID
        dateStart: Date
        dateEnd: Date
        amount: Float
        transactionId: String
        plan: String
    }

    extend type User @key(fields: "_id") {
        _id: ID @external
        payments: [Payment]
    }
`;
