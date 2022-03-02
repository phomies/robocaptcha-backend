import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { PORTS } from '../../utils/ports';
import { AuthResolvers } from './auth.resolvers';
import { AuthTypeDefs } from './auth.typeDefs';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core/dist/plugin/inlineTrace';

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: AuthResolvers, typeDefs: AuthTypeDefs }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
});

server.listen(PORTS['AUTH']).then(({ url }) => {
    console.log(`Auth service is ready at ${url}`);
});
