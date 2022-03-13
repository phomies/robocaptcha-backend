import { Schema, Types } from 'mongoose';

export const callSchema = new Schema({
    _id: Types.ObjectId,
    dateTime: { type: Date, default: Date.now() },
    callSid: String,
    from: String,
    toUserId: { type: String, ref: 'User' },
    action: String,
});
