import mongoose, {ObjectId} from 'mongoose'
import Inc from 'mongoose-sequence'
import {userLeaveSchema} from "./UserLeave.js";

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

const userSchema = new Schema({
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
        type: ObjectId,
        ref: 'Company',
        required: true
    },
    department: {
        type: ObjectId,
        ref: 'Department',
    },
    userLeave: {
        type: [userLeaveSchema],
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
    },
    role: {
        type: String,
    },
    type: {
        type: String,
    },
})

//userSchema.plugin(AutoIncrement, {id: 'user_id', inc_field: '_id'});

export default new mongoose.model('User', userSchema)