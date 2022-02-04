import { IUser } from 'common/interface';
import { User } from '../../db';
import mongoose from 'mongoose';
import hmacSHA256 from 'crypto-js/hmac-sha256';

export const UserQueries = {
    getAllUsers: async (root: any) => {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            throw error;
        }
    },
};

export const UserMutations = {
    createUser: async (root: any, payload: IUser) => {
        try {
            const user = await User.find({
                email: payload.email,
            });

            if (user) {
                throw new Error('User already exist');
            }

            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name: payload.name,
                password: hmacSHA256(payload.password, process.env.HASH_KEY || '').toString(),
                email: payload.email,
            });

            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            throw error;
        }
    },
};
