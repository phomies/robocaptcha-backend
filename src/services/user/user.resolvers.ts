import { Payment, User } from '../../db';
import * as firebase from 'firebase-admin';
import { IContext } from '../../common/interface';
import moment from 'moment';
import mongoose from 'mongoose';
import { TUser } from './user.interface';

export const UserResolvers = {
    User: {
        __resolveReference: async (ref: any) => {
            return await getUser('_id' in ref ? ref._id : ref.googleProviderUid);
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
        checkUser: async (_: any, { email }: any, context: IContext) => {
            const isExist = await User.exists({ email: email });
            return isExist ? true : false;
        },
        loginUser: async (_: any, __: any, context: IContext) => {
            try {
                const token = context.fbToken;
                if (!token || !context.uid) {
                    return;
                }
                const decodedToken = await firebase.auth().verifyIdToken(token);
                const { uid, email, ...details } = decodedToken;
                let user = await User.findOne({ _id: uid });
                let isUserExist = true;

                if (!user) {
                    isUserExist = false;
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

                await firebase.auth().setCustomUserClaims(uid, { permissions: [...user.permissions] });

                return isUserExist;
            } catch (error) {
                console.log('Invalid token');
            }
        },
    },
    Mutation: {
        deleteUser: async (_: any, __: any, context: IContext) => {
            const { email } = await User.findOne({ $or: [{ _id: context.uid }, { googleProviderUid: context.uid }] });
            const { deletedCount } = await User.deleteOne({ $or: [{ _id: context.uid }, { googleProviderUid: context.uid }] });
            if (deletedCount === 0) {
                throw new Error('User does not exist');
            }

            const toDeleteAccounts: string[] = [];
            const userAccounts = await firebase.auth().listUsers(1000);
            userAccounts.users.forEach((user) => {
                const userData = user.toJSON() as TUser;
                const userUid = userData.uid;
                console.log(userData);

                if (userData.email === email) {
                    toDeleteAccounts.push(userUid);
                } else if (userData.providerData) {
                    const googleProvider = userData.providerData.filter((data) => data.providerId === 'google.com');

                    if (googleProvider && googleProvider.length > 0 && googleProvider[0].email === email) {
                        toDeleteAccounts.push(userUid);
                    }
                }
            });

            await firebase.auth().deleteUsers(toDeleteAccounts);
        },
        updateUser: async (_: any, { userInput }: any, context: IContext) => {
            return await User.findByIdAndUpdate(context.uid, userInput, { new: true });
        },
        createUser: async (_: any, { createUserInput }: any, context: IContext) => {
            const userData = {
                _id: context.uid,
                name: createUserInput.name,
                email: createUserInput.email,
                phoneNumber: createUserInput.phoneNumber,
            };
            createUserInput.googleProviderUid &&
                Object.assign(userData, { googleProviderUid: createUserInput.googleProviderUid });

            const newUser = new User(userData);
            await newUser.save();

            const freePayment = new Payment({
                _id: new mongoose.Types.ObjectId(),
                userId: newUser.id,
                dateEnd: moment().add('1', 'month'),
                plan: 'FREE',
            });
            await freePayment.save();
        },
    },
};

const getUser = async (_id: string) => {
    // Search users by either email provider id or google provider id
    const user = await User.findOne({ $or: [{ _id: _id }, { googleProviderUid: _id }] });
    if (!user) {
        throw new Error('User does not exist');
    }
    return user;
};
