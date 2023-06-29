import mongoose, {ObjectId} from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

const companyLeaveSchema = new Schema({
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
        type: ObjectId,
        ref: 'Company',
        required: true
    },
    leaveType: {
        type: ObjectId,
        ref: 'LeaveType',
        required: true
    },
})

//companyLeaveSchema.plugin(AutoIncrement, {id: 'company_leave_id', inc_field: '_id'});

export default new mongoose.model('CompanyLeave', companyLeaveSchema)