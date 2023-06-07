import mongoose from 'mongoose';
import {ApolloServer} from 'apollo-server-express';
import express from 'express';
import cors from 'cors'

import config from "./config.js";
import schema from './schema/index.js';
import getUser from "./utils/context.js";

mongoose.set("strictQuery", true);

const server = new ApolloServer({
    schema,
    context: async ({req}) => {
        return await getUser(req)
    },
});

mongoose.connect(config.MongoDbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB Connected');

        const app = express();

        app.use(cors())

        server.applyMiddleware({
            app,
            path: '/',
        });

        return app.listen(config.Port);
    })
    .then(() => {
        console.log(`GraphQL server running at ${config.Port}`);
    })
    .catch((err) => {
        console.error(err);
    });
