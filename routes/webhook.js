const express = require('express');
const router = express.Router();
const orderProcessor = require('../services/orderProcessor');
const FileService = require('../services/fileService');

router.post('/webhook', (req, res) => {
  const orderData = req.body;

  orderProcessor.saveOrder(orderData);
  orderProcessor.processOrder(orderData);

  res.status(200).send('Webhook received and processed');
});

router.get('/orders/:id/file', async (req, res) => {
  const lineItemId = req.params.id;

  const result = await FileService.findFileByLineItemId(lineItemId);

  if (!result) {
    return res.status(404).send(`No file found for ID ${lineItemId}`);
  }

  const { filePath, fileName } = result;

  res.download(filePath, fileName, err => {
    if (err) {
      console.error('Error sending file:', err);
      if (!res.headersSent) {
        res.status(500).send('Error retrieving file');
      }
    }
  });
});

module.exports = router;
