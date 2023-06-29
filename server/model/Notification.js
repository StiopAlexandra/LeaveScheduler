import mongoose, {ObjectId} from 'mongoose'
import Inc from 'mongoose-sequence'

const AutoIncrement = Inc(mongoose);

const notificationSchema = new mongoose.Schema({
    company: {
        type: ObjectId,
        ref: 'Company',
        required: true
    },
    sender: {
        type: ObjectId,
        ref: 'User'
    },
    receiver: [{
        type: ObjectId,
        ref: 'User'
    }],
    message: {
        type: String,
        required: true
    },
    read: [new mongoose.Schema({
        reader: {
            type: ObjectId,
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

//notificationSchema.plugin(AutoIncrement, {id: 'notification_id', inc_field: '_id'});

export default new mongoose.model('Notification', notificationSchema)