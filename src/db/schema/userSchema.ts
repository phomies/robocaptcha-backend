import { Schema, Types } from 'mongoose';

export const userSchema = new Schema({
    id: Types.ObjectId,
    name: String,
    password: String,
    email: String,
    dateJoined: { type: Date, default: Date.now() },
    whitelist: [Number],
    blacklist: [Number],
    callHistory: [{type: Types.ObjectId, ref: 'Call'}],
    notificationHistory: [{type: Types.ObjectId, ref: 'Notification'}],
});