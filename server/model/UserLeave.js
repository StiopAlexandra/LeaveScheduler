import mongoose, {ObjectId} from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

export const userLeaveSchema = new Schema({
    notes: {
        type: String,
    },
    reason: {
        type: String,
    },
    status: {
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
    user: {
        type: ObjectId,
        ref: 'User',
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
    days: {
        type: Number,
        required: true
    }
})

//userLeaveSchema.plugin(AutoIncrement, {id: 'user_leave_id', inc_field: '_id'});

export default new mongoose.model('UserLeave', userLeaveSchema)