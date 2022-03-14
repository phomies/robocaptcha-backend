import axios from 'axios';
import { IContext } from "../../common/interface";
import { Contact } from '../../db';
import { Connection } from './contact.interface';

const GOOGLE_API_URL = 'https://people.googleapis.com/v1/people/me/connections?personFields=names,phoneNumbers';

export const ContactResolvers = {
    User: {
        contacts: async (user: any) => {
            const contacts = await Contact.find({ userId: user._id });
            return contacts;
        },
    },
    Query: {
        syncContacts: async (_: any, __: any, context: IContext) => {
            // First page
            const { connections, nextPageToken: currentPageToken } = await getGoogleContacts(context.gapiToken);

            // Not all google accounts have contacts
            if (connections) {
                let bulkContacts = getBulkOperations(connections, [], context.uid);
                let nextPage = currentPageToken;

                // Middle pages
                while (nextPage) {
                    const { connections, nextPageToken } = await getGoogleContacts(context.gapiToken, nextPage);
                    nextPage = nextPageToken;
                    bulkContacts = getBulkOperations(connections, bulkContacts, context.uid);
                }
                await Contact.bulkWrite(bulkContacts);
            }
        },
    },
    Mutation: {},
};

const getGoogleContacts = async (token: string, pageToken?: string) => {
    const response = await axios.get(pageToken ? GOOGLE_API_URL + `&pageToken=${pageToken}` : GOOGLE_API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const getBulkOperations = (connections: Connection[], result: any[], id: string) => {
    connections.forEach((connection: Connection) => {
        if (connection.names && connection.phoneNumbers) {
            // Retrieve contact name that is set as primary by owner
            const name = connection.names.filter((name) => name.metadata.primary)[0].displayName;

            connection.phoneNumbers.forEach((phone) => {
                result.push({
                    updateOne: {
                        // Users may change number or name for certain contacts
                        filter: { $or: [{ number: phone.canonicalForm }, { name: name }] },
                        update: { $set: { number: phone.canonicalForm, name: name, userId: id } },
                        upsert: true,
                    },
                });
            });
        }
    });

    return result;
};
