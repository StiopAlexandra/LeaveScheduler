import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type Read {
        reader: User!
        readAt: Date!
    }
    type Notification {
        _id: ID!
        company: Company!
        message: String!
        created: DateTime!
        sender: User!
        receiver: [User]!
        read: [Read]
    }
    input NotificationFilter {
        sender: ID
        receiver: ID
    }
    extend type Query {
        getNotifications(filter: NotificationFilter): [Notification],
        getNotification(id: ID!): Notification
    }
    extend type Mutation {
        createNotification(input: CreateNotificationInput!): Notification
        updateNotification(input: UpdateNotificationInput!): Notification
        deleteNotification(id: ID!): Notification
    }
    extend type Subscription {
        notificationAdded: Notification
    }
    input CreateNotificationInput {
        message: String!
        sender: ID!
        receiver: [ID]!
    }
    input UpdateNotificationInput {
        id: ID!
        reader: ID!
    }
`