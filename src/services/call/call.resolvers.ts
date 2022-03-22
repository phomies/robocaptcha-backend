import mongoose from 'mongoose';
import moment from 'moment';
import { Call } from '../../db';
import { IContext } from '../../common/interface';

type Value = {
    callsAccepted: number;
    callsRejected: number;
};

export const CallResolvers = {
    User: {
        calls: async (user: any) => {
            const calls = await Call.find({ toUserId: user._id });

            return calls.sort((a, b) => {
                const diff = a.dateTime - b.dateTime;

                if (diff == 0) {
                    return a.location.localeCompare(b.location);
                }
                return diff;
            });
        },
    },
    Query: {
        getAllCalls: async () => {
            const calls = await Call.find();
            return calls;
        },
        getCallSummary: async (_: any, __: any, context: IContext) => {
            const calls = await Call.find({ toUserId: context.uid });

            const oneWeekBefore = moment().subtract(7, 'days');
            const twoWeeksBefore = moment().subtract(14, 'days');
            const totalBlockedCalls = calls.filter((call) => call.action === 'blocked').length;
            const callsReceivedByDate = new Map<string, Value>();
            let newCalls = 0;
            let totalCalls = 0;
            let weeklyBlockedCalls = 0;

            for (const call of calls) {
                const date = moment(call.dateTime).format('DD/MM/YYYY');
                const isCallAccepted = call.action === 'success';

                if (!callsReceivedByDate.has(date)) {
                    callsReceivedByDate.set(date, {
                        callsAccepted: isCallAccepted ? 1 : 0,
                        callsRejected: isCallAccepted ? 0 : 1,
                    });
                } else {
                    const callData = callsReceivedByDate.get(date);

                    if (callData) {
                        isCallAccepted && callData['callsAccepted']++;
                        !isCallAccepted && callData['callsRejected']++;

                        callsReceivedByDate.set(date, callData);
                    } else {
                        throw new Error('Something went wrong with generating call summary');
                    }
                }

                if (moment(call.datetime).isAfter(twoWeeksBefore)) {
                    totalCalls++;
                }

                if (moment(call.dateTime).isAfter(oneWeekBefore)) {
                    newCalls++;

                    if (call.action === 'blocked') {
                        weeklyBlockedCalls++;
                    }
                }
            }

            // Total calls includes calls that are one week before
            const oldCalls = totalCalls - newCalls;
            const newCallsPercentage = Math.round(((newCalls - oldCalls) / oldCalls) * 100).toLocaleString() + '%';
            const callsReceived: any = [];
            callsReceivedByDate.forEach((value, key) => {
                callsReceived.push({
                    dateTime: key,
                    callsAccepted: value['callsAccepted'],
                    callsRejected: value['callsRejected'],
                });
            });

            return { callsReceived, weeklyBlockedCalls, totalBlockedCalls, newCalls, newCallsPercentage };
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
