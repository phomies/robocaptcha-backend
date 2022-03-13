import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { PORTS } from '../../utils/ports';
import { DummyResolvers } from './dummy.resolvers';
import { DummyTypeDefs } from './dummy.typeDefs';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core/dist/plugin/inlineTrace';

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: DummyResolvers, typeDefs: DummyTypeDefs }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
});

server.listen(PORTS['DUMMY']).then(({ url }) => {
    console.log(`Dummy service is ready at ${url}`);
});
