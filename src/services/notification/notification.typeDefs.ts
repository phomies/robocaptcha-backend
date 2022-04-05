import { gql } from 'apollo-server';

export const NotificationTypeDefs = gql`
    scalar Date

    type Notification @key(fields: "_id") {
        _id: ID
        userId: String
        googleId: String
        content: String
        read: Boolean
        dateTime: Date
    }

    input NewNotificationInput {
        userId: String
        content: String
        url: String
        dateTime: Date
    }

    extend type User @key(fields: "_id googleProviderUid") {
        _id: String @external
        googleProviderUid: String @external
        notifications: [Notification]
    }

    extend type Mutation {
        createNotification(notificationInput: NewNotificationInput): Notification
        readNotification(_id: ID): Notification
    }
`;
