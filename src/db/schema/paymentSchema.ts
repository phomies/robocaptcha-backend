import { Schema, Types } from 'mongoose';

export const paymentSchema = new Schema({
    _id: Types.ObjectId,
    userId: { type: String, ref: 'User' },
    dateStart: { type: Date, default: Date.now() },
    dateEnd: Date,
    amount: { type: Number, default: 0 },
    transactionId: { type: String, default: '' },
    plan: String,
});
