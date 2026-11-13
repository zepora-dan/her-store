const express = require('express');
const SiteContent = require('../models/SiteContent');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await SiteContent.find();
  let result = {};
  data.forEach(d => result[d.key] = d.value);
  res.json(result);
});

router.put('/:key', auth, async (req, res) => {
  const updated = await SiteContent.findOneAndUpdate(
    { key: req.params.key },
    { value: req.body.value },
    { upsert: true, new: true }
  );
  res.json(updated);
});
module.exports = router;