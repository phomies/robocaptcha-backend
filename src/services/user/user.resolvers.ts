import { User } from '../../db';
import { ObjectId } from 'mongodb';

export const UserResolvers = {
    User: {
        __resolveReference: async (ref: any) => {
            if (!ObjectId.isValid(ref.id)) {
                throw new Error('Invalid ID');
            }

            const user = await User.findOne({ _id: ref.id });
            if (!user) {
                throw new Error('User does not exist');
            }
            return user;
        },
    },
    Query: {
        getAllUsers: async () => {
            try {
                const users = await User.find();
                return users;
            } catch (error) {
                throw error;
            }
        },
        getUser: async (_: any, { id }: any) => {
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid ID');
            }

            const user = await User.findOne({ _id: id });
            if (!user) {
                throw new Error('User does not exist');
            }
            return user;
        },
    },
    Mutation: {
        deleteUser: async (_: any, { id }: any) => {
            const { deletedCount } = await User.deleteOne({ _id: id });
            if (deletedCount === 0) {
                throw new Error('User does not exist');
            }
        },
        updateUser: async (_: any, { userInput }: any) => {
            const { _id, ...userDetails } = userInput;
            const user = await User.findByIdAndUpdate(_id, userDetails, { new: true });

            return user;
        },
    },
};
