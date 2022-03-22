import { Schema, Types } from 'mongoose';

export const contactSchema = new Schema(
    {
        _id: Types.ObjectId,
        number: String,
        name: String,
        userId: { type: String, ref: 'User' },
        isBlacklisted: { type: Boolean, default: false },
        isWhitelisted: { type: Boolean, default: false },
    },
    { timestamps: true }
);
