import mongoose from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const notificationSchema = new mongoose.Schema({
    _id: Number,
    company: {
        type: Number,
        ref: 'Company',
        required: true
    },
    sender: {
        type: Number,
        ref: 'User'
    },
    receiver: [{
        type: Number,
        ref: 'User'
    }],
    message: {
        type: String,
        required: true
    },
    read: [new mongoose.Schema({
        reader: {
            type: Number,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }, { _id: false })],
    created: {
        type: Date,
        default: Date.now,
    },
})

notificationSchema.plugin(AutoIncrement, {id: 'notification_id', inc_field: '_id'});

export default new mongoose.model('Notification', notificationSchema)