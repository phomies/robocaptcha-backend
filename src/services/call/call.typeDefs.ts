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
        countryIso: String
    }

    type ReceivedCall {
        dateTime: Date
        callsAccepted: Int
        callsRejected: Int
    }

    type CallSummary {
        callsAccepted: [Int]
        callsRejected: [Int]
        dateTimes: [String]
        weeklyBlockedCalls: Int
        totalBlockedCalls: Int
        newCalls: Int
        newCallsPercentage: String
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
        getCallSummary: CallSummary
    }

    extend type Mutation {
        createCall(callInput: NewCallInput): Call
    }
`;