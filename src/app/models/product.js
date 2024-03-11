const { text } = require('express');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number},
    name: { type: String },
    kind: {type: String},
    discription: { type: String},
    price: { type: Number },
    image: {type: String},
    quantity_in_stock: {type: Number, required: true},
    quantity_purchased: {type: Number, default: 0},
    input_price: {type: Number, required: true},
    images: { f:{type: String}, s:{ type: String },t:{type: String}}
});

productSchema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
      mongoose.model('Product', productSchema)
        .findOne({}, {}, { sort: { id: -1 } })
        .then((lastProduct) => {
          doc.id = lastProduct ? lastProduct.id + 1 : 1;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next();
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;