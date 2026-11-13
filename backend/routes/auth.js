const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', (req, res) => {
  if (req.body.pin !== process.env.ADMIN_PIN) return res.status(401).json({ message: 'Wrong PIN' });
  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET);
  res.json({ token });
});
module.exports = router;