const express = require('express');
const router = express.Router();
const orderProcessor = require('../services/orderProcessor');

router.post('/webhook', (req, res) => {
  const orderData = req.body;

  orderProcessor.saveOrder(orderData);
  orderProcessor.processOrder(orderData);

  res.status(200).send('Webhook received and processed');
});

module.exports = router;
