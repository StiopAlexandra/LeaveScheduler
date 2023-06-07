import Company from '../../model/Company.js'
import CompanyLeave from '../../model/CompanyLeave.js'
import LeaveType from '../../model/LeaveType.js'

export const resolvers = {
    Query: {
        getCompanyLeaves: async (_, args, context) => {
            const {companyId} = context
            const companyLeaves = await CompanyLeave.find({company: companyId}).exec();
            return companyLeaves;
        },
        getCompanyLeave: async (_, args) => {
            const companyLeave = await CompanyLeave.findById(args.id).exec();
            return companyLeave;
        },
    },
    Mutation: {
        createCompanyLeave: async (_, args, context) => {
            const { input } = args;
            const {companyId} = context

            try {
                const companyLeave = await CompanyLeave.create({
                    ...input,
                    company: companyId,
                });

                return companyLeave
            } catch (error) {
                throw new Error(error);
            }
        },
        updateCompanyLeave: async (_, args) => {
            const {
                input: { id, ...restArgs }
            } = args;
            const companyLeave = await CompanyLeave.findById(id);

            if (!companyLeave) {
                throw new Error('Company leave not found.');
            }

            companyLeave.set({
                ...restArgs
            })

            await companyLeave.save()

            return companyLeave
        },
        deleteCompanyLeave: async (_, args) => {
            const { id } = args;
            const deletedCompanyLeave = await CompanyLeave.findOneAndDelete({ _id: id })
            if (!deletedCompanyLeave) {
                throw new Error(`Company leave not found`)
            }
            return deletedCompanyLeave
        },
    },
    CompanyLeave: {
        company: async ({ company:  company_id}) => {
            const company = await Company.findById({ _id: company_id }).exec();
            return company;
        },
        leaveType: async ({ leaveType:  leaveType_id}) => {
            const leaveType = await LeaveType.findById({ _id: leaveType_id }).exec();
            return leaveType;
        },
    }
}
