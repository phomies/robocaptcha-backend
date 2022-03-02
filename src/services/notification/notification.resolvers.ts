import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Notification } from '../../db';

export const NotificationResolvers = {
    Query: {
        getNotifsToUser: async (_: any, { id }: any) => {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid ID');
            }
            const notifs = await Notification.find({ userId: id });
            return notifs;
        },
    },
    Mutation: {
        createNotification: async (_: any, { notificationInput }: any) => {
            const newNotif = new Notification({
                _id: new mongoose.Types.ObjectId(),
                userId: notificationInput.userId,
                content: notificationInput.content,
                read: false,
                url: notificationInput.url,
                dateTime: notificationInput.dateTime,
            });

            const savedNotif = await newNotif.save();

            return savedNotif;
        },
        readNotification: async (_: any, { id }: any) => {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid ID');
            }

            const notif = await Notification.findByIdAndUpdate(id, { read: true }, { new: true });
            return notif;
        },
    },
    Subscription: {},
};
