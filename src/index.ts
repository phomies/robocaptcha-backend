import 'dotenv/config';
import { initFirebase } from './auth';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
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
        ],
    }),
});

const server = new ApolloServer({
    gateway: gateway,
    plugins: [ApolloServerPluginInlineTraceDisabled()],
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
