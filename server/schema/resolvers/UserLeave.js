import Company from '../../model/Company.js'
import UserLeave from '../../model/UserLeave.js'
import LeaveType from '../../model/LeaveType.js'

export const resolvers = {
    Query: {
        getUserLeaves: async (_, args, context) => {
            const {companyId} = context
            const userLeaves = await UserLeave.find({company: companyId, ...args.filter}).exec();
            return userLeaves;
        },
        getUserLeave: async (_, args) => {
            const userLeave = await UserLeave.findById(args.id).exec();
            return userLeave;
        },
    },
    Mutation: {
        createUserLeave: async (_, args, context) => {
            const { input } = args;
            const {companyId} = context

            console.log(input)

            try {
                const userLeave = await UserLeave.create({
                    ...input,
                    company: companyId,
                });

                return userLeave
            } catch (error) {
                throw new Error(error);
            }
        },
        updateUserLeave: async (_, args) => {
            const {
                input: { id, ...restArgs }
            } = args;
            const userLeave = await UserLeave.findById(id);

            if (!userLeave) {
                throw new Error('User leave not found.');
            }

            userLeave.set({
                ...restArgs
            })

            await userLeave.save()

            return userLeave
        },
        deleteUserLeave: async (_, args) => {
            const { id } = args;
            const deletedUserLeave = await UserLeave.findOneAndDelete({ _id: id })
            if (!deletedUserLeave) {
                throw new Error(`User leave not found`)
            }
            return deletedUserLeave
        },
    },
    UserLeave: {
        company: async ({ company:  company_id}) => {
            const company = await Company.findById({ _id: company_id }).exec();
            return company;
        },
        leaveType: async ({ leaveType:  leaveType_id}) => {
            const leaveType = await LeaveType.findById({ _id: leaveType_id }).exec();
            return leaveType;
        },
        user: async ({ user:  user_id}) => {
            const user = await User.findById({ _id: user_id }).exec();
            return user;
        },
    }
}
