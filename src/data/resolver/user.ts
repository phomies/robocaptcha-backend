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
    getUser: async (_: any, { id }: any) => {
        try {
            const user = await User.findOne({_id: id});
            if (!user) {
                throw new Error('User does ont exist');
            }
            return user;
        } catch(error) {
            throw error;
        }
    }
};

export const UserMutations = {
    createUser: async (_: any, { userInput }: any) => {
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
            phoneNumber: userInput.phoneNumber,
            email: userInput.email,
            verificationLevel: userInput.verificationLevel
        });

        const savedUser = await newUser.save();

        return savedUser;
    },
    deleteUser: async (_: any, { id }: any) => {
        const { deletedCount } = await User.deleteOne({ _id: id });
        if (deletedCount === 0) {
            throw new Error('User does not exist');
        }
    },
    updateUser: async (_: any, { userInput }: any) => {
        const user = await getUserById(userInput._id);

        if (userInput.password !== undefined) {
            if (userInput.newPassword === undefined) {
                throw new Error('New password is empty');
            }

            const passwordHash = hmacSHA256(userInput.password, process.env.HASH_KEY || '').toString();
            if (user.password !== passwordHash) {
                throw new Error('Invalid password');
            }

            // Reassign new password
            userInput.password = hmacSHA256(userInput.newPassword, process.env.HASH_KEY || '').toString();
        }

        const { newPassword, ...userDetails } = userInput;
        Object.assign(user, userDetails);

        await user.save();
        return user;
    },
};

const getUserById = async (id: string) => {
    const user = await User.findOne({ _id: id });

    if (!user) {
        throw new Error('User does not exist');
    }

    return user;
};
