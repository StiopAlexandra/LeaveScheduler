import mongoose from 'mongoose';
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import cors from 'cors'
import http from 'http';
import * as cron from 'node-cron'

import config from "./config.js";
import schema from './schema/index.js';
import getUser from "./utils/context.js";
import User from "./model/User.js";
import {getDecodedToken} from "./utils/token.js";
import markAsInactive from "./utils/markAsInactive.js";
import markAsActive from "./utils/markAsActive.js";

mongoose.set("strictQuery", true);

const app = express();

app.use(cors());

const server = new ApolloServer({
    schema,
    context: async ({req, connection}) => {
        if (connection) {
            const { user, companyId } = connection.context;
            return {
                user,
                companyId,
            };
        } else {
            return await getUser(req)
        }
    },
    subscriptions: {
        onConnect: async(connectionParams) => {
            const authParam = connectionParams[`Authorization`];
            if (authParam) {
                const decodedToken = await getDecodedToken(
                    authParam.replace('Bearer ', '')
                );
                return {
                    user: await User.findOne({id: decodedToken.userId}),
                    companyId: decodedToken.companyId
                }
            }
        },
    },
    introspection: true,
    playground: true,
});

server.applyMiddleware({
    app,
    path: '/graphql',
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

mongoose.connect(config.MongoDbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');

        httpServer.listen(config.Port, () => {
            console.log(`GraphQL server running on http://localhost:${config.Port}/graphql`);
        });
    })
    .then(() => {
        cron.schedule('0 0 0 * * *', () => {
            markAsActive();
            markAsInactive()
        });
    })
    .catch((err) => {
        console.error(err);
    });
