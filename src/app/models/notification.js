const mongoose = require('mongoose');

const Notifications = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    read_status: {
        type: Boolean,
        default: false
    }

});

const Notification = mongoose.model('Notification', Notifications);
module.exports = Notification;