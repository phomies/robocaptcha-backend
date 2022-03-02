import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { PORTS } from '../../utils/ports';
import { NotificationResolvers } from './notification.resolvers';
import { NotificationTypeDefs } from './notification.typeDefs';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core/dist/plugin/inlineTrace';

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: NotificationResolvers, typeDefs: NotificationTypeDefs }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
});

server.listen(PORTS['NOTIFICATION']).then(({ url }) => {
    console.log(`Notification service is ready at ${url}`);
});
