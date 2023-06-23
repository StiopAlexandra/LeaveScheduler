import mongoose from 'mongoose'
import Inc from 'mongoose-sequence'
import UserLeave, {userLeaveSchema} from "./UserLeave.js";

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

const userSchema = new Schema({
    _id: Number,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    manager: {
        type: Boolean,
        default: false
    },
    company: {
        type: Number,
        ref: 'Company',
        required: true
    },
    department: {
        type: Number,
        ref: 'Department',
    },
    userLeave: {
        type: [userLeaveSchema],
        //ref: 'UserLeave',
    },
    created: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'active',
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    dateOfBirth: {
        type: Date,
    },
    dateOfEmployment: {
        type: Date,
        //required: true
    },
    role: {
        type: String,
    },
    type: {
        type: String,
    },
})

userSchema.plugin(AutoIncrement, {id: 'user_id', inc_field: '_id'});

export default new mongoose.model('User', userSchema)