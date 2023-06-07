import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type Department {
        _id: ID!
        name: String!
        color: String!
        maxAbsentEmployees: Int!
        company: Company!
    }
    extend type Query {
        getDepartments: [Department],
        getDepartment(id: ID!): Department
    }
    extend type Mutation {
        createDepartment(input: CreateDepartmentInput!): Department
        updateDepartment(input: UpdateDepartmentInput!): Department
        deleteDepartment(id: ID!): Department
    }
    input CreateDepartmentInput {
        name: String!
        maxAbsentEmployees: Int!
        color: String
    }
    input UpdateDepartmentInput {
        id: ID!
        name: String
        maxAbsentEmployees: Int
        color: String
    }
`