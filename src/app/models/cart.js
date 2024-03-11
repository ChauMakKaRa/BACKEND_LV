const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  item: [
    {
      id_product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
    }
  ],
  
  total: {
    type: Number,
    required: true
  },
  order: {
    type: Boolean,
    default: false,
    required: true, 
  },
  status: {
    type: String,
    enum: ['Chờ duyệt', 'Đang giao', 'Đã giao'],
    default: 'Chờ duyệt',
    },
  delivery_address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
  },
  pay: {
    type: String,
    default:'Chưa thanh toán',
    required: true, 
  }
});

CartSchema.pre('save', function (next) {
  const doc = this;
  if (doc.isNew) {
    mongoose.model('Cart', CartSchema)
      .findOne({}, {}, { sort: { id: -1 } })
      .then((lastCart) => {
        doc.id = lastCart ? lastCart.id + 1 : 1;
        next();
      })
      .catch((error) => {
        next(error);
      });
  } else {
    next();
  }
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
