import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index';
import { typeDefs } from './data/schema';
import { resolvers } from './data/resolver';
import { ApolloServer } from 'apollo-server-express';
import { dateScalar } from './data/scalars';

Object.assign(resolvers, { Date: dateScalar });

const startApolloServer = async () => {
    const port = process.env.PORT || 3000;
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    server.applyMiddleware({ app });

    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    app.use('/', indexRouter);

    app.listen(port, () => {
        console.log(`App is listening on port ${port}`);
    });
};

startApolloServer();
