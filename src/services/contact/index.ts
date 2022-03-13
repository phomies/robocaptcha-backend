import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { PORTS } from '../../utils/ports';
import { ContactResolvers } from './contact.resolvers';
import { ContactTypeDefs } from './contact.typeDefs';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core/dist/plugin/inlineTrace';

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: ContactResolvers, typeDefs: ContactTypeDefs }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
});

server.listen(PORTS['CONTACT']).then(({ url }) => {
    console.log(`Contact service is ready at ${url}`);
});
