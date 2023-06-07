import pkg from 'graphql-iso-date';
const { GraphQLDateTime, GraphQLDate, GraphQLTime } = pkg;

export const resolvers = {
    DateTime: GraphQLDateTime,
    Date: GraphQLDate,
    Time: GraphQLTime,
}
