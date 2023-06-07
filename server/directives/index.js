import isAuthenticated from './isAuthenticated.js';

export default {
    typeDefs: [isAuthenticated.typeDef],
    schemaDirectives: {
        isAuthenticated: isAuthenticated.directive,
    },
};