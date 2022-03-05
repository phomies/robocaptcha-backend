import { Schema, Types } from 'mongoose';

export const notificationSchema = new Schema({
    id: Types.ObjectId,
    userId: { type: String, ref: 'User' },
    content: String,
    read: Boolean,
    url: String,
    dateTime: { type: Date, default: Date.now() },
});
