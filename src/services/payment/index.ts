import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { PORTS } from '../../utils/ports';
import { PaymentResolvers } from './payment.resolvers';
import { PaymentTypeDefs } from './payment.typeDefs';
import { ApolloServerPluginInlineTraceDisabled } from "apollo-server-core";

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: PaymentResolvers, typeDefs: PaymentTypeDefs }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
});

server.listen(PORTS['PAYMENT']).then(({ url }) => {
    console.log(`Payment service is ready at ${url}`);
});
