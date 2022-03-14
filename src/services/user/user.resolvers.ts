import { User } from '../../db';
import * as firebase from 'firebase-admin';

export const UserResolvers = {
    User: {
        __resolveReference: async (ref: any) => {
            return await getUser(ref._id);
        },
    },
    Query: {
        getAllUsers: async () => {
            const users = await User.find();
            return users;
        },
        getUser: async (_: any, { _id }: any) => {
            return await getUser(_id);
        },
        loginUser: async (_: any, { token }: any) => {
            try {
                console.log(`${token} Trying to login`);
                const decodedToken = await firebase.auth().verifyIdToken(token);
                const { uid, email, ...details } = decodedToken;
                let user = await User.findOne({ _id: uid });

                if (!user) {
                    const newUser = new User({
                        _id: uid,
                        name: email?.substring(0, email.indexOf('@')), // Set username as email ID
                        email: email,
                    });

                    await newUser.save();
                    user = await User.findOne({ _id: uid }); // Retrieve updated details
                }

                return await firebase.auth().setCustomUserClaims(uid, { permissions: [...user.permissions] });
            } catch (error) {
                // if (error instanceof Error) {
                //     throw new Error(error.message);
                // }
                console.log(error);
            }
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

const getUser = async (_id: string) => {
    const user = await User.findById(_id);
    if (!user) {
        throw new Error('User does not exist');
    }
    return user;
};
