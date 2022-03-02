import { gql } from "apollo-server";

export const CallTypeDefs = gql`
    scalar Date

    type Call @key(fields: "_id") {
        _id: ID
        dateTime: Date
        callSid: String
        from: String
        toUserId: ID
        action: String
    }

    input NewCallInput {
        dateTime: Date
        callSid: String
        from: String
        toUserId: ID
        action: String
    }

    extend type User @key(fields: "_id") {
        _id: ID @external
        calls: [Call]
    }
    
    extend type Query {
        getAllCalls: [Call]
        getCallsToUser(id: ID): [Call]
    }

    extend type Mutation {
        createCall(callInput: NewCallInput): Call
    }
`;