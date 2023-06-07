import Company from '../../model/Company.js'
import User from '../../model/User.js'
import bcrypt from 'bcryptjs'
import generator from 'generate-password'

import tokenUtil from '../../utils/token.js';
import {template, transporter} from "../../utils/nodemailer.js";
import Department from "../../model/Department.js";

export const resolvers = {
    Query: {
        getUsers: async (_, args, context) => {
            const {companyId} = context
            const users = await User.find({company: companyId}).exec();
            return users;
        },
        getUser: async (_, args) => {
            const user = await User.findById(args.id).exec();
            return user;
        },
        me: async (_, args, context) => {
            const { user } = context;
            return user
        },
    },
    Mutation: {
        signin: async (_, args) => {
            const { email, password } = args;
            const user = await User.findOne({
                email,
            });

            if (!user) {
                throw new Error('User not found.');
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                throw new Error('Password is incorrect.');
            }
            const token = await tokenUtil.create(user);

            return {
                user,
                token,
            };
        },
        signup: async (_, args) => {
            const { name, email, password, manager, company } = args;
            try {
                const existingUser = await User.findOne({
                    email,
                });

                if (existingUser) {
                    throw new Error('User already exists!')
                }

                const hashedPassword = await bcrypt.hash(password, 12);

                const user = await User.create({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    manager: manager,
                    company: company,
                });

                return {
                    name: user.name,
                    email: user.email,
                    id: user.id,
                    password: null,
                    manager: user.manager,
                    company: user.company,
                };
            } catch (error) {
                throw new Error(error);
            }
        },
        createUser: async (_, args, context) => {
            const { input } = args;
            const {companyId} = context
            const {email} = input

            try {
                const existingUser = await User.findOne({
                    email,
                });

                if (existingUser) {
                    throw new Error('User already exists!')
                }

                const password = generator.generate({
                    length: 8,
                    numbers: true
                });

                const hashedPassword = await bcrypt.hash(password, 12);

                const user = await User.create({
                    ...input,
                    password: hashedPassword,
                    company: companyId,
                });

                const resetToken = await tokenUtil.create(user);

                const emailTemplate = template('resetPassword.hbs')

                const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

                const html = emailTemplate({ email, resetLink })

                const mailOptions = {
                    from: 'noreply@leave-scheduler.com',
                    to: email,
                    //to: 'tteodora126@gmail.com',
                    subject: 'Resetare parolă',
                    html: html
                };
                await transporter.sendMail(mailOptions, (error) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('Email sent!');
                    }
                });

                return {
                    user,
                    token: resetToken,
                };
            } catch (error) {
                throw new Error(error);
            }
        },
        updateUser: async (_, args) => {
            const {
                input: { id, ...restArgs }
            } = args;
            const user = await User.findOne({ id });

            if (!user) {
                throw new Error('User not found.');
            }

            user.set({
                ...restArgs
            })

            await user.save()

            return user
        },
        resetPassword: async (_, args) => {
            const { id, password } = args;
            const user = await User.findById(id);

            if (!user) {
                throw new Error('User not found.');
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            user.set({
                password: hashedPassword
            })

            await user.save()

            return user
        },
        deleteUser: async (_, args) => {
            const { id } = args;
            const deletedUser = await User.findOneAndDelete({ _id: id })
            if (!deletedUser) {
                throw new Error(`User not found`)
            }
            return deletedUser
        },
    },
    User: {
        company: async ({ company: company_id}) => {
            const company = await Company.findById(company_id).exec();
            return company;
        },
        department: async ({ department: department_id}) => {
            const department = await Department.findById(department_id).exec();
            return department;
        },
    }
}
