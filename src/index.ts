import 'dotenv/config';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import { PORTS } from './utils/ports';
import waitOn from 'wait-on';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';

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
                request.http.headers.set('authorization', context.token);
            },
        });
    },
});

const server = new ApolloServer({
    gateway: gateway,
    plugins: [ApolloServerPluginInlineTraceDisabled()],
    context: ({ req }) => {
        const token = req.headers.authorization || '';

        return { token };
    },
});

const options = {
    resources: Object.values(PORTS)
        .filter((port) => port !== PORTS['ROOT'])
        .map((port) => `tcp:${port}`),
};

waitOn(options).then(() => {
    server.listen(PORTS['ROOT']).then(({ url }) => {
        console.log(`Server is listening at ${url}`);
    });
});
