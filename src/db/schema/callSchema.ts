import { Schema, Types } from 'mongoose';

export const callSchema = new Schema({
    id: Types.ObjectId,
    date: { type: Date, default: Date.now() },
    from: Number,
    toUserId: {type: Types.ObjectId, ref: 'User'},
    action: String,
});
