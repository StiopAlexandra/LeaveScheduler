import Company from "../../model/Company.js";
import LeaveType from "../../model/LeaveType.js";

export const resolvers = {
    Query: {
        getCompanies: async () => {
            const companies = await Company.find().exec();
            return companies;
        },
        getCompany: async (_, args, context) => {
            const {companyId} = context
            const company = await Company.findById({_id: companyId}).exec();
            return company;
        },
    },
    Mutation: {
        addCompany: async (_, args) => {
            const {email, name} = args;
            const existingCompany = await Company.findOne({
                email,
            });
            if (existingCompany) {
                throw new Error('Company already exists!');
            }
            const company = await Company.create({
                name: name,
                email: email,
            })
            try {
                [
                    {name: "Holiday", allowanceDays: 21, color: '#009688', default: true, company: company._id},
                    {name: "Public Holiday", color: '#8bc34a', default: true, company: company._id},
                    {name: "Sick Leave", color: '#3f51b5', company: company._id},
                    {name: "Unpaid Leave", color: '#ff1744', company: company._id},
                    {name: "Maternity", color: '#ff5722', company: company._id},
                    {name: "Compassionate", color: '#ffc107', company: company._id},
                ].map(leaveType => LeaveType.create(leaveType))
            } catch (error) {
                throw new Error(error);
            }

            return company
        },
        updateCompany: async (_, args) => {
            const {
                input: {id, ...restArgs}
            } = args;
            const company = await Company.findById(id);

            if (!company) {
                throw new Error('Company not found.');
            }

            company.set({
                ...restArgs
            })

            await company.save()

            return company
        },
    }
}