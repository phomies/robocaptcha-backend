import mongoose from 'mongoose';
import faker from '@faker-js/faker';
import moment from 'moment';
import { Call, User, Notification, Contact } from '../../db';
import { phone } from 'phone';

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
            const contacts = [];
            const calls = [];
            const notifications = [];
            const phoneNumbers = getRandomPhoneNumbers(random);

            for (let i = 0; i < random; i++) {
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);
                const action = getRandomAction();
                const number = phoneNumbers[i];
                const datetime = getRandomDate(startDate, endDate);

                const newContact = new Contact({
                    _id: new mongoose.Types.ObjectId(),
                    number: number.phoneNumber,
                    name: faker.name.findName(),
                    userId: _id,
                });
                contacts.push(newContact.save());

                for (let j = 0; j < random / 3; j++) {
                    const newCall = new Call({
                        _id: new mongoose.Types.ObjectId(),
                        dateTime: datetime,
                        callSid: faker.datatype.uuid(),
                        from: number.phoneNumber,
                        toUserId: _id,
                        action: action,
                        countryIso: number.countryIso2,
                        countryCode: number.countryCode,
                    });
                    calls.push(newCall.save());

                    const newNotif = new Notification({
                        _id: new mongoose.Types.ObjectId(),
                        userId: _id,
                        content: getMatchingContent(action, number.phoneNumber),
                        read: false,
                        url: faker.internet.url(),
                        datetime: datetime,
                    });
                    notifications.push(newNotif.save());
                }
            }
            await Promise.all([...contacts, ...calls, ...notifications]);

            return {
                contacts: contacts.length,
                calls: calls.length,
                notifications: notifications.length,
            };
        },
        deleteDummyData: async (_: any, { _id }: any) => {
            const calls = await Call.deleteMany({ toUserId: _id });
            const notifications = await Notification.deleteMany({ userId: _id });
            const contacts = await Contact.deleteMany({ userId: _id });

            return {
                calls: calls.deletedCount,
                notifications: notifications.deletedCount,
                contacts: contacts.deletedCount,
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

const getRandomPhoneNumbers = (amount: number) => {
    const phoneNumbers = [];

    while (phoneNumbers.length < amount) {
        let rawNumber = faker.phone.phoneNumber();

        rawNumber = (rawNumber.includes('x') && rawNumber.substring(0, rawNumber.indexOf('x') - 1)) || '';
        const number = phone(rawNumber);

        if (number.isValid) {
            phoneNumbers.push(number);
        }
    }

    return phoneNumbers;
};

const getRandomAction = () => {
    const ACTIONS = ['success', 'progress', 'timeout', 'blocked'];

    return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
};

const getRandomDate = (start: Date, end: Date) => {
    return moment(new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())));
};

const getMatchingContent = (action: string, number: string) => {
    let content = '';

    switch (action) {
        case 'success':
            content = 'Successfully received call from';
            break;
        case 'timeout':
            content = 'Call timed out from';
            break;
        case 'blocked':
            content = 'Successfully blocked call from';
            break;
        default:
            content = 'Something wrong occured from';
            break;
    }

    return `${content} number ${number}`;
};
