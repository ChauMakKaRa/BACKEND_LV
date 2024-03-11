const mongoose = require('mongoose');

const RepairSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    content_repair: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Duyệt', 'Đã duyệt'],
        default: 'Chờ duyệt',
    },
    
},
{
    timestamps: true
});



const Repair = mongoose.model('Repair', RepairSchema);
module.exports = Repair;