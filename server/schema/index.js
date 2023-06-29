import { makeExecutableSchema } from '@graphql-tools/schema'
import resolversMap from "./resolvers/index.js";
import typesArray from "./types/index.js";

const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversMap,
});

export default schema