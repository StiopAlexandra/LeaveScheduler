import mongoose, {ObjectId} from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

const leaveTypeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '#2979ff'
    },
    allowanceDays: {
        type: Number,
    },
    default: {
        type: Boolean,
        default: false
    },
    company: {
        type: ObjectId,
        ref: 'Company',
        required: true
    },
})

//leaveTypeSchema.plugin(AutoIncrement, {id: 'leave_type_id', inc_field: '_id'});

export default new mongoose.model('LeaveType', leaveTypeSchema)