const Cart = require('../../models/cart');
const {User, Address} = require('../../models/user');
const Product = require('../../models/product');
const Comment = require('../../models/comment');
const Delivery = require('../../models/delivery_address');
const Notification = require('../../models/notification');
const Shipper = require('../../models/shipper');
const Repair = require('../../models/repair');

const getOrders = async(req, res, next) => {
    try {
        await Cart.find({status: 'Đã duyệt'})
            .populate('user_id')
            .populate('item.id_product')
            .then(orders => res.json(orders))
            .catch(next);
    } catch (error) {
        console.log(error);
    }
}

const getRepairs = async(req, res, next) => {
    try {
        await Repair.find({status: 'Đã duyệt'})
            .then(repairs => res.json(repairs))
            .catch(next);
    } catch (error) {   
        console.log(error);
    }
}

const processCarts = async(items) => {
    items.forEach(async (item) => {
        const product = await Product.findOne({ _id: item.id_product });
        product.quantity_purchased -= item.quantity;
        await product.save();
    });
}
const cofirmDelivered = async(req, res) => {
    const { cart_id } = req.query;
    try {
        const carts = await Cart.findById(cart_id);
        const items = carts.item;
        const cart = await Cart.findOneAndUpdate(
            {_id: cart_id },
            {$set: {status: 'Đã giao' }},
        );
        if(!cart) {
            res.json({message: 'Không tìm thấy đơn hàng.'})
        } else {
            await processCarts(items);
            res.json({message: 'Xác nhận đã giao thành công.'})
        }
    } catch (error) {
        console.log(error);
    }
}

const deleteRepair = async(req, res) => {
    const { id } = req.query;
    try {
        if(id) {
            await Repair.findByIdAndDelete(id)
            .then(() => res.json({message: 'Đã xóa đơn sửa thành công.'}));
        } else {
            res.json({message: 'Không tìm thấy đơn sửa chữa.'})
        }
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    getOrders,
    getRepairs,
    cofirmDelivered,
    deleteRepair
}