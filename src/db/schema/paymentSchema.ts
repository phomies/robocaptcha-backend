import { Schema, Types } from 'mongoose';

export const paymentSchema = new Schema({
    _id: Types.ObjectId,
    userId: {type: String, ref: 'User'},
    dateStart: Date,
    dateEnd: Date,
    amount: Number,
    plan: String,
});