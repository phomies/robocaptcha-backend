import { Schema, Types } from 'mongoose';

export const notificationSchema = new Schema({
    _id: Types.ObjectId,
    userId: { type: String, ref: 'User' },
    googleId: { type: String, default: '' },
    content: String,
    read: Boolean,
    url: String,
    dateTime: { type: Date, default: Date.now() },
});
