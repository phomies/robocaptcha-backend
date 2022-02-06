import { gql } from 'apollo-server-express';
import fs from 'fs';
import path from 'path';

const importGraphQL = (file: string) => {
    return fs.readFileSync(path.join(__dirname, file), 'utf-8');
};

const gqlWrapper = (...files: string[]) => {
    return gql`
        ${files}
    `;
};

const schema = importGraphQL('./schema.graphql');

export const typeDefs = gqlWrapper(schema);
