import mongoose from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

const companyLeaveSchema = new Schema({
    _id: Number,
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    company: {
        type: Number,
        ref: 'Company',
        required: true
    },
    leaveType: {
        type: Number,
        ref: 'LeaveType',
        required: true
    },
})

companyLeaveSchema.plugin(AutoIncrement, {id: 'company_leave_id', inc_field: '_id'});

export default new mongoose.model('CompanyLeave', companyLeaveSchema)