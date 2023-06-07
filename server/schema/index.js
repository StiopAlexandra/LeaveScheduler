import { makeExecutableSchema } from '@graphql-tools/schema'
import resolversMap from "./resolvers/index.js";
import typesArray from "./types/index.js";
import directives from "../directives/index.js";

const schema = makeExecutableSchema({
    typeDefs: [...typesArray, ...directives.typeDefs],
    resolvers: resolversMap,
    schemaDirectives: {
        ...directives.schemaDirectives,
    },
});

export default schema