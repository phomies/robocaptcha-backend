import { User } from '../../db';
import { ObjectId } from 'mongodb';
import * as firebase from 'firebase-admin';

export const UserResolvers = {
    User: {
        __resolveReference: async (ref: any) => {
            console.log(ref);
            if (!ObjectId.isValid(ref._id)) {
                throw new Error('Invalid ID');
            }

            const user = await User.findById(ref._id);
            if (!user) {
                throw new Error('User does not exist');
            }
            return user;
        },
    },
    Query: {
        getAllUsers: async () => {
            const users = await User.find();
            return users;
        },
        getUser: async (_: any, { _id }: any) => {
            if (!ObjectId.isValid(_id)) {
                throw new Error('Invalid ID');
            }

            const user = await User.findById(_id);
            if (!user) {
                throw new Error('User does not exist');
            }
            return user;
        },
        loginUser: async (_: any, { _id, token }: any) => {
            try {
                const user = await User.findById(_id);
                const decodedToken = await firebase.auth().verifyIdToken(token);
                console.log(decodedToken);
                // if (!user) {
                //     const newUser = new User({
                //         _id: _id,
                //     });
                // }
            } catch (error) {}
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
