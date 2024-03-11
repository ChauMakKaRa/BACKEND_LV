const mongoose = require('mongoose');

const PaySchema = new mongoose.Schema({
    id: {
        type: Number
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment_text: {
        type: String
    },
    comment_date: {
        type: Date
    },
    like_counts: {
        type: Number
    }

});



const Pay = mongoose.model('Pay', PaySchema);
module.exports = Pay;