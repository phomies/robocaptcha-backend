import { Schema, Types } from 'mongoose';

export const userSchema = new Schema({
    id: Types.ObjectId,
    name: String,
    password: String,
    email: String,
    phoneNumber: Number,
    maskedNumber: Number,
    dateJoined: { type: Date, default: Date.now() },
    whitelist: [Number],
    blacklist: [Number],
    verificationLevel: {type: Number, min: 0, max: 3, required: true},
    subscriptionHistory: [{
        dateStart: {type: Date},
        dateEnd: {type: Date},
        amount: Number,
        transactionId: String,
        type: String
    }],
    callHistory: [{type: Types.ObjectId, ref: 'Call'}],
    notificationHistory: [{type: Types.ObjectId, ref: 'Notification'}],
});