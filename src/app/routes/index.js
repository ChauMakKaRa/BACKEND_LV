const express = require('express');

const costomerRouter = require('./costomer');
const adminRouter = require('./adminRouter');
const shipperRouter = require('./shipper');

const router = express.Router();

router.use('/api/', costomerRouter);
router.use('/api/', adminRouter);
router.use('/api/', shipperRouter);

module.exports = router;