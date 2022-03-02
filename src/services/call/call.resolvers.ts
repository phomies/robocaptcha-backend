import { ObjectId } from 'mongodb';
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
};
