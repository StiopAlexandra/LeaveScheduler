import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type Company {
        _id: ID!
        name: String!
        email: String!
        phone: String
        country: String
        address: String
        timezone: String
        dateFormat: String
        timeFormat: String
        weekStart: Int
        workingDays: [Int]
    }
    extend type Query {
        getCompanies: [Company],
        getCompany: Company
    }
    extend type Mutation {
        addCompany(name: String!, email: String!): Company
        updateCompany(input: UpdateCompanyInput!): Company!
    }
    input UpdateCompanyInput {
        id: ID!
        name: String
        email: String
        phone: String
        country: String
        address: String
        timezone: String
        dateFormat: String
        timeFormat: String
        weekStart: Int
        workingDays: [Int]
    }
`
