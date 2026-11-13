const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();
  res.status(201).json(newOrder);
});

router.get('/', auth, async (req, res) => {
  res.json(await Order.find().sort({ createdAt: -1 }));
});

router.patch('/:id', auth, async (req, res) => {
  await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
  res.json({ message: 'Updated' });
});
module.exports = router;