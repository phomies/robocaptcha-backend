import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { PORTS } from '../../utils/ports';
import { CallResolvers } from './call.resolvers';
import { CallTypeDefs } from './call.typeDefs';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core/dist/plugin/inlineTrace';

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: CallResolvers, typeDefs: CallTypeDefs }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
    context: ({ req }) => {
        const uid = req.headers.uid || '';

        return { uid };
    },
});

server.listen(PORTS['CALL']).then(({ url }) => {
    console.log(`Call service is ready at ${url}`);
});
