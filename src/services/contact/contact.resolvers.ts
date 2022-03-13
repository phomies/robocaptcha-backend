import mongoose from 'mongoose';
import moment from 'moment';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export const ContactResolvers = {
    User: {},
    Query: {
        getContacts: async (_: any, { _id, token }: any, context: any) => {
            const OAuthClient = new OAuth2Client(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URL
            );
            console.log(context);
        },
    },
    Mutation: {},
};
