import 'dotenv/config';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import { PORTS } from './utils/ports';
import waitOn from 'wait-on';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { initFirebase } from './auth';
import * as firebase from 'firebase-admin';

const getUrl = (port: number) => {
    const BASE_URL = process.env.URL || 'http://localhost:';

    return BASE_URL + port;
};

const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
            { name: 'user', url: getUrl(PORTS['USER']) },
            { name: 'payment', url: getUrl(PORTS['PAYMENT']) },
            { name: 'call', url: getUrl(PORTS['CALL']) },
            { name: 'notification', url: getUrl(PORTS['NOTIFICATION']) },
            { name: 'dummy', url: getUrl(PORTS['DUMMY']) },
            { name: 'contact', url: getUrl(PORTS['CONTACT']) },
        ],
    }),
    buildService({ url }) {
        return new RemoteGraphQLDataSource({
            url,
            willSendRequest({ request, context }: any) {
                // Forward token to subgraphs as headers
                request.http.headers.set('fbToken', context.fbToken);
                request.http.headers.set('gapiToken', context.gapiToken);
                request.http.headers.set('uid', context.uid);
            },
        });
    },
});

const server = new ApolloServer({
    gateway: gateway,
    plugins: [ApolloServerPluginInlineTraceDisabled()],
    context: async ({ req }) => {
        const fbToken = req.headers.fbtoken || '';
        const gapiToken = req.headers.gapitoken || '';
        let uid = '';

        try {
            if (fbToken) {
                const decodedToken = await firebase.auth().verifyIdToken(String(fbToken));
                const { uid: uuid, ...details } = decodedToken;
                uid = uuid;
            }

            return { uid, fbToken, gapiToken };
        } catch (error) {
            const code = (error as any).code;

            if (code === 'auth/id-token-revoked') {
                console.log('Revoked firebase access token');
            } else if (code === 'auth/id-token-expired') {
                console.log('Expired firebase access token');
            }
        }
    },
});

const options = {
    resources: Object.values(PORTS)
        .filter((port) => port !== PORTS['ROOT'])
        .map((port) => `tcp:${port}`),
};

waitOn(options).then(() => {
    initFirebase();
    server.listen(PORTS['ROOT']).then(({ url }) => {
        console.log(`Server is listening at ${url}`);
    });
});
