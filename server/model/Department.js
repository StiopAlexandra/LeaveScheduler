import mongoose, {ObjectId} from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const Schema = mongoose.Schema

const departmentSchema = new Schema({
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
        type: ObjectId,
        ref: 'Company',
        required: true
    },
})

//departmentSchema.plugin(AutoIncrement, {id: 'department_id', inc_field: '_id'});

export default new mongoose.model('Department', departmentSchema)