import { Schema } from 'mongoose';

export const userSchema = new Schema({
    _id: String,
    googleProviderUid: String,
    name: String,
    email: String,
    phoneNumber: { type: String, default: '' },
    maskedNumber: { type: String, default: '' },
    dateJoined: { type: Date, default: Date.now() },
    verificationLevel: { type: Number, min: 0, max: 3, default: 1 },
    permissions: { type: [String], default: ['GUEST'] },
});
