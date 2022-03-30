import { Payment, User } from '../../db';
import * as firebase from 'firebase-admin';
import { IContext } from '../../common/interface';
import moment from 'moment';

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
        getUser: async (_: any, __: any, context: IContext) => {
            return await getUser(context.uid);
        },
        loginUser: async (_: any, __: any, context: IContext) => {
            try {
                const token = context.fbToken;
                if (!token) {
                    return;
                }

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

                    // By default, all new accounts have free subscription plan
                    const freePayment = new Payment({
                        userId: uid,
                        dateEnd: moment().add('1', 'month'),
                        plan: 'FREE',
                    });
                    await freePayment.save();
                }

                return await firebase.auth().setCustomUserClaims(uid, { permissions: [...user.permissions] });
            } catch (error) {
                console.log('Invalid token');
            }
        },
    },
    Mutation: {
        deleteUser: async (_: any, __: any, context: IContext) => {
            const { deletedCount } = await User.deleteOne({ _id: context.uid });
            if (deletedCount === 0) {
                throw new Error('User does not exist');
            }
        },
        updateUser: async (_: any, { userInput }: any, context: IContext) => {
            return await User.findByIdAndUpdate(context.uid, userInput, { new: true });
        },
        createUser: async (_: any, { createUserInput }: any, context: IContext) => {
            const user = new User({
                _id: context.uid,
                name: createUserInput.name,
                email: createUserInput.email,
                phoneNumber: createUserInput.phoneNumber,
            });
            await user.save();

            const freePayment = new Payment({
                userId: context.uid,
                dateEnd: moment().add('1', 'month'),
                plan: 'FREE',
            });
            await freePayment.save();
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
