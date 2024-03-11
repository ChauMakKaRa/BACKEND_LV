const mongoose = require('mongoose');

const Shippers = new mongoose.Schema({
    id: {
        type: Number
    },
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart',
        required: true
    },
    

});

const Shipper = mongoose.model('Shipper', Shippers);
module.exports = Shipper;