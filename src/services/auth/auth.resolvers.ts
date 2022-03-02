import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { User } from '../../db';
import * as firebase from 'firebase-admin';

export const AuthResolvers = {
    Query: {
        login: async (_: any, { _id, token }: any) => {
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
    Mutation: {},
};
