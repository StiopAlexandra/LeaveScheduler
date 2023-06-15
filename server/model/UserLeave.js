import mongoose from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

const userLeaveSchema = new Schema({
    _id: Number,
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
        type: Number,
        ref: 'User',
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
    days: {
        type: Number,
        required: true
    }
})

userLeaveSchema.plugin(AutoIncrement, {id: 'user_leave_id', inc_field: '_id'});

export default new mongoose.model('UserLeave', userLeaveSchema)