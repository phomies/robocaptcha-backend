import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { Notification } from '../../db';

export const NotificationResolvers = {
    User: {
        notifications: async (user: any) => {
            const notifications = await Notification.find({ userId: user._id });
            return notifications;
        },
    },
    Query: {},
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
        readNotification: async (_: any, { _id }: any) => {
            if (!ObjectId.isValid(_id)) {
                throw new Error('Invalid ID');
            }

            const notif = await Notification.findByIdAndUpdate(_id, { read: true }, { new: true });
            return notif;
        },
    },
};


