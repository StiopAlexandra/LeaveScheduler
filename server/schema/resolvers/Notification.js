import Company from '../../model/Company.js'
import Notification from '../../model/Notification.js'
import User from "../../model/User.js";
import { PubSub } from 'graphql-subscriptions';
import {template, transporter} from "../../utils/nodemailer.js";
const pubsub = new PubSub();

export const resolvers = {
    Query: {
        getNotifications: async (_, args, context) => {
            const {companyId} = context
            const {sender, receiver} = args?.filter || {}
            const query = { company: companyId };
            if (sender) query.sender = sender;
            if (receiver) query.receiver = { $in: receiver };

            const notifications = await Notification.find(query).exec();
            return notifications;
        },
        getNotification: async (_, args) => {
            const notification = await Notification.findById(args.id).exec();
            return notification;
        },
    },
    Mutation: {
        createNotification: async (_, args, context) => {
            const { input } = args;
            const { sender, receiver, message} = input
            const {companyId} = context

            try {
                const notification = await Notification.create({
                    ...input,
                    company: companyId,
                });

                pubsub.publish('NOTIFICATION_ADDED', { notificationAdded: notification });

                const emailTemplate = template('notification.hbs')

                for (const item of receiver) {
                    const to = await User.findById({ _id: item }).exec();
                    const from = await User.findById({ _id: sender }).exec();
                    const email = to.email
                    const name = from.name
                    const html = emailTemplate({ email, message, name })

                    const mailOptions = {
                        from: 'leavescheduler@gmail.com',
                        to: email,
                        subject: 'Notification',
                        html: html
                    };
                    await transporter.sendMail(mailOptions, (error) => {
                        if (error) {
                            console.error(error);
                        } else {
                            console.log('Email sent!');
                        }
                    });
                }

                return notification
            } catch (error) {
                throw new Error(error);
            }
        },
        updateNotification: async (_, args) => {
            const {
                input: { id, reader }
            } = args;
            const notification = await Notification.findById(id);

            if (!notification) {
                throw new Error('Notification not found.');
            }

            notification.read.push({
                reader: reader,
            });

            await notification.save();

            return notification
        },
        deleteNotification: async (_, args) => {
            const { id } = args;
            const deletedNotification = await Notification.findOneAndDelete({ _id: id })
            if (!deletedNotification) {
                throw new Error(`Notification not found`)
            }
            return deletedNotification
        },
    },
    Subscription: {
        notificationAdded: {
            subscribe: (_, args, context) => {
                const {companyId} = context

                const iterator = pubsub.asyncIterator(['NOTIFICATION_ADDED']);

                const filterFn = (payload) => {
                    const notificationCompanyId = payload.notificationAdded.company;
                    console.log(notificationCompanyId.equals(companyId))
                    return notificationCompanyId.equals(companyId);
                };

                const filteredIterator = {
                    [Symbol.asyncIterator]: () => ({
                        async next() {
                            while (true) {
                                const { value, done } = await iterator.next();

                                if (done || filterFn(value)) {
                                    return { value, done };
                                }
                            }
                        },
                    }),
                };

                return filteredIterator;
            },
        },
    },
    Notification: {
        company: async ({ company:  company_id}) => {
            const company = await Company.findById({ _id: company_id }).exec();
            return company;
        },
        sender: async ({ sender:  user_id}) => {
            const user = await User.findById({ _id: user_id }).exec();
            return user;
        },
        receiver: async ({ receiver:  user_id}) => {
            const user = await User.findById({ _id: user_id }).exec();
            return user;
        },
    },
    Read: {
        reader: async ({reader}) => {
            const user = await User.findById({ _id: reader }).exec()
            return user;
        },
    }
}
