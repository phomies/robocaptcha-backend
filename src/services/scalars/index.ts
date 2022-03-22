import { GraphQLScalarType, Kind } from 'graphql';

export const dateScalar = new GraphQLScalarType({
    name: 'Date',
    parseValue(value) {
        return new Date(value);
    },
    serialize(value) {
        return value.getTime();
    },
    parseLiteral(ast: any) {
        if (ast.kind === Kind.INT) {
            return parseInt(ast.value, 10);
        }
        return null;
    },
});
