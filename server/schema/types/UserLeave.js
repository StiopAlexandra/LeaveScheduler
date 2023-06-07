import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type UserLeave {
        _id: ID!
        notes: String
        status: String!
        startDate: Date!
        endDate: Date!
        user: User!
        company: Company!
        leaveType: LeaveType!
        days: Int!
    }
    input UserLeaveFilter {
        status: String
        leaveType: ID
        user: ID
    }
    extend type Query {
        getUserLeaves(filter: UserLeaveFilter): [UserLeave],
        getUserLeave(id: ID!): UserLeave
    }
    extend type Mutation {
        createUserLeave(input: CreateUserLeaveInput!): UserLeave
        updateUserLeave(input: UpdateUserLeaveInput!): UserLeave
        deleteUserLeave(id: ID!): UserLeave
    }
    input CreateUserLeaveInput {
        status: String!
        startDate: Date!
        endDate: Date!
        leaveType: ID!
        user: ID!
        notes: String
        days: Int
    }
    input UpdateUserLeaveInput {
        id: ID!
        status: String
        notes: String
        startDate: Date
        endDate: Date
        leaveType: ID
        user: ID
        days: Int
    }
`