const express = require('express');
const routerAdmin = express.Router();
const { 
    getAccountAdmin, getUserExceptAdmin, 
    addUser, updateInfoUser, deleteUser, 
    deleteAllChecked, getAllOrders, getContacts, 
    processOrder, 
    getRepairs,
    processRepair,
    deleteCart,
    sendEmail,
    addProduct,
    getOrderById,
    deleteOrderByID,
    deleteContactById
    
} = require('../controllers/admin');

routerAdmin.route('/admin').get(getAccountAdmin).post(addUser).put(updateInfoUser).delete(deleteUser);
routerAdmin.route('/user-except-admin').get(getUserExceptAdmin);
routerAdmin.route('/delete_user_checked').delete(deleteAllChecked);
routerAdmin.route('/get-all-order').get(getAllOrders);
routerAdmin.route('/contacts-admin').get(getContacts).delete(deleteContactById);
routerAdmin.route('/cart-admin').put(processOrder).delete(deleteCart);
routerAdmin.route('/repair-admin').get(getRepairs).patch(processRepair);
routerAdmin.route('/user-admin').post(sendEmail);
routerAdmin.route('/products').post(addProduct);
routerAdmin.route('/get-order-by-id').get(getOrderById).delete(deleteOrderByID);

module.exports = routerAdmin;