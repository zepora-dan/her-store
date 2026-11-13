const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Category.find()));
router.post('/', auth, async (req, res) => {
  const newCat = new Category({ name: req.body.name, slug: req.body.name.toLowerCase() });
  await newCat.save();
  res.json(newCat);
});
router.delete('/:id', auth, async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
module.exports = router;