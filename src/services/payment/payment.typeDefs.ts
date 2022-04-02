import { gql } from 'apollo-server';

export const PaymentTypeDefs = gql`
    scalar Date

    type Payment @key(fields: "_id") {
        _id: ID
        userId: String
        dateStart: Date
        dateEnd: Date
        amount: Float
        transactionId: String
        plan: String
        isCancelled: Boolean
    }

    input UpsertPaymentInput {
        dateStart: Date
        dateEnd: Date!
        amount: Float!
        transactionId: String!
        plan: String!
    }

    extend type User @key(fields: "_id") {
        _id: String @external
        payments: [Payment]
    }

    extend type Mutation {
        upsertPayment(upsertPaymentInput: UpsertPaymentInput): Payment
        deletePayment: Boolean
    }
`;
