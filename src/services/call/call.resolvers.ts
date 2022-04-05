import mongoose from 'mongoose';
import moment from 'moment';
import { Call, User } from '../../db';
import { IContext } from '../../common/interface';
import { CallReceive } from './call.interface';

type Value = {
    callsAccepted: number;
    callsRejected: number;
};

const SUCCESS_STATES = ['success', 'whitelisted'];
const FAILURE_STATES = ['blocked', 'timeout', 'blacklisted'];

export const CallResolvers = {
    User: {
        calls: async (user: any) => {
            const calls = await Call.find({ $or: [{ userId: user._id }, { userId: user.googleProviderUid }] });

            return calls.sort((a, b) => {
                const diff = new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();

                if (diff == 0) {
                    return a.countryIso.localeCompare(b.location);
                }
                return diff;
            });
        },
    },
    Query: {
        getCallSummary: async (_: any, __: any, context: IContext) => {
            console.log(context)
            const currentUser = await User.findOne({ $or: [{ _id: context.uid }, { googleProviderUid: context.uid }]});
            const calls = await Call.find({ $or: [{ toUserId: currentUser._id }, { toUserId: currentUser.googleProviderId }]});

            const oneWeekBefore = moment(new Date()).subtract(6, 'days');
            const twoWeeksBefore = moment(new Date()).subtract(13, 'days');
            const totalBlockedCalls = calls.filter((call) => FAILURE_STATES.includes(call.action)).length;
            const callsReceivedByDate = new Map<string, Value>();

            let tempDate = moment(new Date()).subtract(6, 'days');
            for (let i = 0; i < 7; i++) {
                callsReceivedByDate.set(tempDate.format('DD/MM/YYYY'), {
                    callsAccepted: 0,
                    callsRejected: 0,
                });
                tempDate = tempDate.add(1, 'days');
            }
            let newCalls = 0;
            let totalCalls = 0;
            let weeklyBlockedCalls = 0;

            for (const call of calls) {
                const date = moment(call.dateTime).format('DD/MM/YYYY');
                const isCallAccepted = SUCCESS_STATES.includes(call.action);

                const callData = callsReceivedByDate.get(date);

                if (callData) {
                    isCallAccepted && callData['callsAccepted']++;
                    !isCallAccepted && callData['callsRejected']++;

                    callsReceivedByDate.set(date, callData);
                }

                if (moment(call.datetime).isAfter(twoWeeksBefore)) {
                    totalCalls++;
                }

                if (moment(call.dateTime).isAfter(oneWeekBefore)) {
                    newCalls++;

                    if (FAILURE_STATES.includes(call.action)) {
                        weeklyBlockedCalls++;
                    }
                }
            }

            // Total calls includes calls that are one week before
            const oldCalls = totalCalls - newCalls;
            const rawNewCallsPercentage = Math.round(((newCalls - oldCalls) / oldCalls) * 100);
            let newCallsPercentage = '0%';

            if (rawNewCallsPercentage == Infinity) {
                newCallsPercentage = ``;
            } else if (rawNewCallsPercentage <= 0) {
                newCallsPercentage = `${rawNewCallsPercentage}%`;
            } else if (rawNewCallsPercentage > 0) {
                newCallsPercentage = `+${rawNewCallsPercentage}%`;
            }

            const callsReceived: CallReceive[] = [];
            callsReceivedByDate.forEach((value, key) => {
                callsReceived.push({
                    dateTime: key,
                    callsAccepted: value['callsAccepted'],
                    callsRejected: value['callsRejected'],
                });
            });

            callsReceived.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
            const callsAccepted: number[] = [];
            const callsRejected: number[] = [];
            const dateTimes: string[] = [];

            callsReceived.forEach((call) => {
                dateTimes.push(call.dateTime);
                callsAccepted.push(call.callsAccepted);
                callsRejected.push(call.callsRejected);
            });

            return {
                callsAccepted,
                callsRejected,
                dateTimes,
                weeklyBlockedCalls,
                totalBlockedCalls,
                newCalls,
                newCallsPercentage,
            };
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
