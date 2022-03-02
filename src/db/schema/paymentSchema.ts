import { Schema, Types } from 'mongoose';

export const paymentSchema = new Schema({
    id: Types.ObjectId,
    userId: Types.ObjectId,
    dateStart: Date,
    dateEnd: Date,
    amount: Number,
    plan: String,
});