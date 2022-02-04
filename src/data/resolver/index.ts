import { UserMutations, UserQueries } from './user';

export const resolvers = {
    Query: {
        ...UserQueries,
    },
    Mutation: {
        ...UserMutations,
    }
};
