import { gql } from "apollo-server";

export const CallTypeDefs = gql`
    scalar Date

    type Call @key(fields: "_id") {
        _id: ID
        dateTime: Date
        callSid: String
        from: String
        toUserId: User
        action: String
    }

    extend type User @key(fields: "_id") {
        _id: ID @external
    }
`;