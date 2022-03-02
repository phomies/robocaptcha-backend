import 'dotenv/config';
import { initFirebase } from './auth';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server';
import { PORTS } from './utils/ports';
import waitOn from 'wait-on';

const getUrl = (port: number) => {
    const BASE_URL = process.env.URL || 'http://localhost:';

    return BASE_URL + port;
};

const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
        subgraphs: [{ name: 'users', url: getUrl(PORTS['USERS']) }],
    }),
});

const server = new ApolloServer({
    gateway: gateway,
});

initFirebase();

const options = {
    resources: Object.values(PORTS).map((port) => `tcp:${port}`),
};

waitOn(options).then(() => {
    server.listen(PORTS['ROOT']).then(({ url }) => {
        console.log(`Server is listening at ${url}`);
    });
});

// const startApolloServer = async () => {
//     initFirebase();

//     const port = process.env.PORT || 3000;
//     const app = express();
//     app.use(logger('dev'));
//     app.use(express.json());
//     app.use(express.urlencoded({ extended: false }));
//     app.use(cookieParser());
//     // app.use(authMiddleware);
//     app.use('/', indexRouter);

//     const server = new ApolloServer({
//         schema: buildFederatedSchema([{ typeDefs, resolvers }]),
//         context: ({ req }) => {
//             req;
//         },
//         formatError: (err: any) => {
//             // TODO - FORMAT ERROR BEFORE SENDING BACK TO CLIENT
//             return err;
//         },
//     });

//     await server.start();
//     server.applyMiddleware({
//         app,
//     });

//     app.listen(port, () => {
//         console.log(`App is listening on port ${server.graphqlPath}`);
//     });
// };

// startApolloServer();
