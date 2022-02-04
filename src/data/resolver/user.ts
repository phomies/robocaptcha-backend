import { User } from '../../db';
import mongoose from 'mongoose';
import hmacSHA256 from 'crypto-js/hmac-sha256';

export const UserQueries = {
    getAllUsers: async () => {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            throw error;
        }
    },
};

export const UserMutations = {
    createUser: async (_: any, { userInput }: any) => {
        try {
            const user = await User.findOne({
                email: userInput.email,
            });

            if (user) {
                throw new Error('User already exist');
            }

            const newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name: userInput.name,
                password: hmacSHA256(userInput.password, process.env.HASH_KEY || '').toString(),
                email: userInput.email,
            });

            const savedUser = await newUser.save();
            console.log(savedUser);
            return savedUser;
        } catch (error) {
            throw error;
        }
    },
};
