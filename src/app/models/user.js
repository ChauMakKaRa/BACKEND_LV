const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const addressSchema = new Schema({
    phone: {
        type: String,
        required: true
    },
    name: {
        type: String,
    },
    number_house: {
        type: String,
    },
    street: {
      type: String,
      required: true
    },
    village: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    choose: {
        type: Boolean,
        default: false,
    }
  });

const UserSchema = new Schema({
    id: {
        type: Number,
    },
    roles: {
        type: String,
    },
    name: {
        type: String,
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,   
    },
    password: {
        type: String,
    },
    addresses: [addressSchema],
    phone: {type: String},
    gender: {type: String},
},{
    timestamps: true
});

UserSchema.pre('save', function (next) {
    const doc = this;
    if (doc.isNew) {
      mongoose.model('User', UserSchema)
        .findOne({}, {}, { sort: { id: -1 } })
        .then((lastUser) => {
          doc.id = lastUser ? lastUser.id + 1 : 1;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next();
    }
});
const Address = mongoose.model('Address', addressSchema);
const User = mongoose.model('User', UserSchema);
module.exports =  {User, Address};


