import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type CompanyLeave {
        _id: ID!
        title: String!
        startDate: Date!
        endDate: Date!
        company: Company!
        leaveType: LeaveType!
    }
    extend type Query {
        getCompanyLeaves: [CompanyLeave],
        getCompanyLeave(id: ID!): CompanyLeave
    }
    extend type Mutation {
        createCompanyLeave(input: CreateCompanyLeaveInput!): CompanyLeave
        updateCompanyLeave(input: UpdateCompanyLeaveInput!): CompanyLeave
        deleteCompanyLeave(id: ID!): CompanyLeave
    }
    input CreateCompanyLeaveInput {
        title: String!
        startDate: Date!
        endDate: Date!
        leaveType: ID!
    }
    input UpdateCompanyLeaveInput {
        id: ID!
        title: String
        startDate: Date
        endDate: Date
        leaveType: ID
    }
`