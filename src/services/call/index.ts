import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { PORTS } from '../../utils/ports';
import { CallResolvers } from './call.resolvers';
import { CallTypeDefs } from './call.typeDefs';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core/dist/plugin/inlineTrace';
import { initFirebase } from "../../auth";

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: CallResolvers, typeDefs: CallTypeDefs }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
});

server.listen(PORTS['CALL']).then(({ url }) => {
    initFirebase();
    console.log(`Call service is ready at ${url}`);
});
