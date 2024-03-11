const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Delivery = new Schema({
        id: {
                type: Number,
            },
        phone: {
            type: String,
        },
        name: {
            type: String,
        },
        address: [{
            province: {
                type: String
            },
            city: {
                type: String
            },
            district: {
                type: String
            },
            commune: {
                type: String
            },
            village: {
                type: String
            },
            street: {
                type: Number
            },

        }],
        
    },
    { 
        timestamps: true 
    }
);

const delivery_address = mongoose.model('Delivery', Delivery);
module.exports =  delivery_address;


