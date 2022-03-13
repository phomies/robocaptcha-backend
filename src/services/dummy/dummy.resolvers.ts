import mongoose from 'mongoose';
import faker from '@faker-js/faker';
import moment from 'moment';
import { Call, User, Notification } from '../../db';

export const DummyResolvers = {
    User: {
        calls: async (user: any) => {
            const calls = await Call.find({ toUserId: user._id });
            return calls;
        },
    },
    Mutation: {
        createDummyData: async (_: any, { _id }: any) => {
            const user = await User.findById(_id);

            if (!user) {
                throw Error(`User ${_id} does not exist`);
            }

            const random = getRandomNumber(0, 10);

            for (let i = 0; i < random; i++) {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);
                const action = getRandomAction();
                const number = faker.phone.phoneNumber('+65########');
                const datetime = getRandomDate(startDate, endDate);

                const newCall = new Call({
                    _id: new mongoose.Types.ObjectId(),
                    dateTime: datetime,
                    callSid: faker.datatype.uuid(),
                    from: number,
                    toUserId: _id,
                    action: action,
                });
                await newCall.save();

                const newNotif = new Notification({
                    _id: new mongoose.Types.ObjectId(),
                    userId: _id,
                    content: getMatchingContent(action, number),
                    read: false,
                    url: faker.internet.url(),
                    datetime: datetime,
                });
                await newNotif.save();
            }

            return;
        },
        deleteDummyData: async (_: any, { _id }: any) => {
            const calls = await Call.deleteMany({ toUserId: _id });
            const notifications = await Notification.deleteMany({ userId: _id });

            return {
                calls: calls.deletedCount,
                notifications: notifications.deletedCount,
            };
        },
    },
};

const getRandomNumber = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    // The maximum is inclusive and the minimum is inclusive
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const getRandomAction = () => {
    const ACTIONS = ['success', 'progress', 'timeout'];

    return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
};

const getRandomDate = (start: Date, end: Date) => {
    return moment(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
};

const getMatchingContent = (action: string, number: string) => {
    let content = '';

    switch (action) {
        case 'success':
            content = 'Successfully call from ';
            break;
        case 'timeout':
            content = 'Call timed out from ';
            break;
        default:
            content = 'Something wrong occured from ';
            break;
    }

    return `${content} number ${number}`;
};
