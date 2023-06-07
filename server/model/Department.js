import mongoose from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

const departmentSchema = new Schema({
    _id: Number,
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: '#673ab7'
    },
    maxAbsentEmployees: {
        type: Number,
        required: true
    },
    company: {
        type: Number,
        ref: 'Company',
        required: true
    },
})

departmentSchema.plugin(AutoIncrement, {id: 'department_id', inc_field: '_id'});

export default new mongoose.model('Department', departmentSchema)