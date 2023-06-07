import Company from '../../model/Company.js'
import Department from '../../model/Department.js'

export const resolvers = {
    Query: {
        getDepartments: async (_, args, context) => {
            const {companyId} = context
            const departments = await Department.find({company: companyId}).exec();
            return departments;
        },
        getDepartment: async (_, args) => {
            const department = await Department.findById(args.id).exec();
            return department;
        },
    },
    Mutation: {
        createDepartment: async (_, args, context) => {
            const { input } = args;
            const {companyId} = context

            try {
                const department = await Department.create({
                    ...input,
                    company: companyId,
                });

                return department
            } catch (error) {
                throw new Error(error);
            }
        },
        updateDepartment: async (_, args) => {
            const {
                input: { id, ...restArgs }
            } = args;
            const department = await Department.findById(id);

            if (!department) {
                throw new Error('Department not found.');
            }

            department.set({
                ...restArgs
            })

            await department.save()

            return department
        },
        deleteDepartment: async (_, args) => {
            const { id } = args;
            const deletedDepartment = await Department.findOneAndDelete({ _id: id })
            if (!deletedDepartment) {
                throw new Error(`Department not found`)
            }
            return deletedDepartment
        },
    },
    Department: {
        company: async ({ company:  company_id}) => {
            const company = await Company.findById({ _id: company_id }).exec();
            return company;
        },
    }
}
