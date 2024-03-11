const express = require('express');
const costomerRouter = express.Router();

const {
    getProducts, getDetail, 
    getProductById, addToCart, 
    login, register, 
    getCartWithIdUser, 
    deleteProduct, getPay, 
    addAddressWithIdUser, 
    getAddressUserById, 
    updateAddress, orderCart, 
    getOrder, getDetailOrder,
    updateMyFile,
    getOnlyAddressOfUserById,
    deleteAddress,updatePass,
    getProductWithKeySearch,
    addContact,
    addRepair,
    getNotification,
    getNotificationByID,
    addComment,
    getComments,
    handleLike,
    handleReplyComment,
    handlePayPal
    } = require('../controllers/index');

costomerRouter.route('/products').get(getProducts);
costomerRouter.route('/detail').get(getDetail);
costomerRouter.route('/detail-product').get(getProductById);
costomerRouter.route('/cart').post(addToCart).get(getCartWithIdUser).delete(deleteProduct).get(getPay);
costomerRouter.route('/login').post(login);
costomerRouter.route('/register').post(register);
costomerRouter.route('/user').put(addAddressWithIdUser).get(getAddressUserById).patch(updateAddress);
costomerRouter.route('/order').put(orderCart).get(getOrder);
costomerRouter.route('/detailorder').get(getDetailOrder);
costomerRouter.route('/my-account').patch(updateMyFile);
costomerRouter.route('/address').get(getOnlyAddressOfUserById).delete(deleteAddress);
costomerRouter.route('/pass').patch(updatePass)
costomerRouter.route('/search').get(getProductWithKeySearch);
costomerRouter.route('/contacts').post(addContact);
costomerRouter.route('/repair').post(addRepair);
costomerRouter.route('/notification').get(getNotification);
costomerRouter.route('/paypal').patch(handlePayPal);
costomerRouter.route('/notification-by-id').get(getNotificationByID);
costomerRouter.route('/comment-user').get(getComments).post(addComment).patch(handleLike).put(handleReplyComment);
module.exports = costomerRouter;