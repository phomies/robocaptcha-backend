import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { UserResolvers } from './user.resolvers';
import { UserTypeDefs } from './user.typeDefs';
import { PORTS } from '../../utils/ports';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { initFirebase } from "../../auth";

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: UserResolvers, typeDefs: UserTypeDefs }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
    context: ({ req }) => {
        const uid = req.headers.uid || '';
        const gapiToken = req.headers.gapitoken || '';
        const fbToken = req.headers.fbtoken || '';

        return { uid, fbToken, gapiToken };
    },
});

server.listen(PORTS['USER']).then(({ url }) => {
    initFirebase();
    console.log(`User service is ready at ${url}`);
});
