import Company from '../../model/Company.js'
import LeaveType from '../../model/LeaveType.js'

export const resolvers = {
    Query: {
        getLeaveTypes: async (_, args, context) => {
            const {companyId} = context
            const leaveTypes = await LeaveType.find({company: companyId, ...args.filter}).exec();
            return leaveTypes;
        },
        getLeaveType: async (_, args) => {
            const leaveType = await LeaveType.findById(args.id).exec();
            return leaveType;
        },
    },
    Mutation: {
        createLeaveType: async (_, args, context) => {
            const { input } = args;
            const {companyId} = context

            try {
                const leaveType = await LeaveType.create({
                    ...input,
                    company: companyId,
                });

                return leaveType
            } catch (error) {
                throw new Error(error);
            }
        },
        updateLeaveType: async (_, args) => {
            const {
                input: { id, ...restArgs }
            } = args;
            const leaveType = await LeaveType.findById(id);

            if (!leaveType) {
                throw new Error('Leave type not found.');
            }

            leaveType.set({
                ...restArgs
            })

            await leaveType.save()

            return leaveType
        },
        deleteLeaveType: async (_, args) => {
            const { id } = args;
            const deletedLeaveType = await LeaveType.findOneAndDelete({ _id: id })
            if (!deletedLeaveType) {
                throw new Error(`Leave type not found`)
            }
            return deletedLeaveType
        },
    },
    LeaveType   : {
        company: async ({ company:  company_id}) => {
            const company = await Company.findById({ _id: company_id }).exec();
            return company;
        },
    }
}
