import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type LeaveType {
        _id: ID!
        name: String!
        color: String!
        default: Boolean!
        allowanceDays: Int
        company: Company!
    }
    input LeaveTypeFilter {
        name: String
        default: Boolean
    }
    extend type Query {
        getLeaveTypes(filter: LeaveTypeFilter): [LeaveType],
        getLeaveType(id: ID!): LeaveType
    }
    extend type Mutation {
        createLeaveType(input: CreateLeaveTypeInput!): LeaveType
        updateLeaveType(input: UpdateLeaveTypeInput!): LeaveType
        deleteLeaveType(id: ID!): LeaveType
    }
    input CreateLeaveTypeInput {
        name: String!
        allowanceDays: Int
        color: String
    }
    input UpdateLeaveTypeInput {
        id: ID!
        name: String
        allowanceDays: Int
        color: String
    }
`