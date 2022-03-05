import { gql } from "apollo-server";

export const CallTypeDefs = gql`
    scalar Date

    type Call @key(fields: "_id") {
        _id: ID
        dateTime: Date
        callSid: String
        from: String
        toUserId: String
        action: String
    }

    input NewCallInput {
        dateTime: Date
        callSid: String
        from: String
        toUserId: String
        action: String
    }

    extend type User @key(fields: "_id") {
        _id: String @external
        calls: [Call]
    }
    
    extend type Query {
        getAllCalls: [Call]
    }

    extend type Mutation {
        createCall(callInput: NewCallInput): Call
    }
`;