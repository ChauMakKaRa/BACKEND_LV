const mongoose = require('mongoose');

const Comments = new mongoose.Schema({
    id: {
        type: Number
    },
    number_star: {
        type: Number,
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
    image: [{
        type: String  
    }],
    comment_date: {
        type: Date,
        default: Date.now
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    reply: [{
            user_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            content: {
                type: String
            }
    }]
});



const Comment = mongoose.model('Comment', Comments);
module.exports = Comment;