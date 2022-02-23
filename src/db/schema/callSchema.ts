import { Schema, Types } from 'mongoose';

export const callSchema = new Schema({
    id: Types.ObjectId,
    dateTime: { type: Date, default: Date.now() },
    callSid: String,
    from: String,
    toUserId: {type: Types.ObjectId, ref: 'User'},
    action: String,
});
