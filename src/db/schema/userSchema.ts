import { Schema, Types } from 'mongoose';

export const userSchema = new Schema({
    id: Types.ObjectId,
    name: String,
    password: String,
    email: String,
    phoneNumber: String,
    maskedNumber: String,
    dateJoined: { type: Date, default: Date.now() },
    whitelist: [Number],
    blacklist: [Number],
    verificationLevel: {type: Number, min: 0, max: 3, required: true},
    subscriptionHistory: [{
        dateStart: {type: Date},
        dateEnd: {type: Date},
        amount: Number,
        transactionId: String,
        plan: String
    }],
});