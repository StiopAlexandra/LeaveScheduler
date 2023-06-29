import mongoose from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    country: {
        type: String,
    },
    address: {
        type: String,
    },
    timezone: {
        type: String,
    },
    dateFormat: {
        type: String,
        default: "d/MM/Y"
    },
    timeFormat: {
        type: String,
        default: "h:i a"
    },
    weekStart: {
        type: Number,
        default: 1
    },
    workingDays: {
        type: [Number],
        default: [1, 2, 3, 4, 5]
    },
})

//companySchema.plugin(AutoIncrement, {id: 'company_id', inc_field: '_id'});

export default new mongoose.model('Company', companySchema)