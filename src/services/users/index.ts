import 'dotenv/config';
import { buildSubgraphSchema } from '@apollo/federation';
import { ApolloServer } from 'apollo-server';
import { UserResolvers } from './users.resolvers';
import { UserTypeDefs } from './users.typeDefs';
import { PORTS } from '../../utils/ports';

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ resolvers: UserResolvers, typeDefs: UserTypeDefs }]),
});

server.listen(PORTS['USERS']).then(({ url }) => {
    console.log(`User service is ready at ${url}`);
});
