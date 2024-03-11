const express = require('express');
const shipperRouter = express.Router();
const { getOrders, cofirmDelivered, getRepairs, deleteRepair } = require('../controllers/shipper');

shipperRouter.route('/cart-shipper').get(getOrders).patch(cofirmDelivered)
shipperRouter.route('/repair-shipper').get(getRepairs).delete(deleteRepair);

module.exports = shipperRouter;