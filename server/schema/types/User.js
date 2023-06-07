import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        manager: Boolean!
        company: Company!
        created: DateTime!
        department: Department
        phone: String
        address: String
        role: String
        type: String
        dateOfBirth: Date
        dateOfEmployment: Date
    }
    type AuthData {
        user: User
        token: String!
    }
    extend type Query {
        getUsers: [User],
        getUser(id: ID!): User
        me: User @isAuthenticated,
    }
    extend type Mutation {
        signin(email: String!, password: String!): AuthData
        signup(name: String!, email: String!, password: String!, manager: Boolean!, company: ID!): User
        createUser(input: CreateUserInput!): AuthData
        resetPassword(id: ID!, password: String!): User
        updateUser(input: UpdateUserInput!): User
        deleteUser(id: ID!): User
    }
    input CreateUserInput {
        name: String!
        email: String!
        manager: Boolean
        department: ID
        phone: String
        address: String
        role: String
        type: String
        dateOfBirth: Date
        dateOfEmployment: Date
    }
    input UpdateUserInput {
        id: ID!
        name: String
        email: String
        manager: Boolean
        department: ID
        phone: String
        address: String
        role: String
        type: String
        dateOfBirth: Date
        dateOfEmployment: Date
    }
`