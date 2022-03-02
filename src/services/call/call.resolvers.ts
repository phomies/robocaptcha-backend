import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Call } from '../../db';

export const CallResolvers = {
    User: {
        calls: async (user: any) => {
            const calls = await Call.find({ toUserId: user._id });
            return calls;
        },
    },
    Query: {
        getCallsToUser: async (_: any, { _id }: any) => {
            if (!ObjectId.isValid(_id)) {
                throw new Error('Invalid ID');
            }
            const calls = await Call.find({ toUserId: _id });

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
