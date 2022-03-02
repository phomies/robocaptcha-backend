import { ObjectId } from 'mongodb';
import mongoose from "mongoose";
import { Call } from '../../db';

export const CallResolvers = {
    Query: {
        getCallsToUser: async (_: any, { id }: any) => {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid ID');
            }
            const calls = await Call.find({ toUserId: id });

            return calls;
        },
        getAllCalls: async () => {
            const calls = await Call.find();
            return calls;
        },
    },
    Mutation: {
        createCall: async (_: any, { callInput }: any) => {
            const newCall = new Call({
                _id: new mongoose.Types.ObjectId(),
                dateTime: callInput.dateTime,
                callSid: callInput.callSid,
                from: callInput.from,
                toUserId: callInput.toUserId,
                action: callInput.action,
            });

            const savedCall = await newCall.save();

            return savedCall;
        },
    },
};
