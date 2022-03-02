import { gql } from 'apollo-server';

export const NotificationTypeDefs = gql`
    scalar Date

    type Notification @key(fields: "_id") {
        _id: ID
        userId: ID
        content: String
        read: Boolean
        url: String
        dateTime: Date
    }

    input NewNotificationInput {
        userId: ID
        content: String
        url: String
        dateTime: Date
    }

    extend type User @key(fields: "_id") {
        _id: ID @external
        notifications: [Notification]
    }

    extend type Mutation {
        createNotification(notificationInput: NewNotificationInput): Notification
        readNotification(_id: ID): Notification
    }
`;
