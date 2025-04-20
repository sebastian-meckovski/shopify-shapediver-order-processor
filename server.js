const express = require('express');
const bodyParser = require('body-parser');
const webhookRoutes = require('./routes/webhook');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3015;

// Middleware
app.use(bodyParser.json());

// Ensure 'orders' directory exists
const ordersDir = path.join(__dirname, 'orders');
if (!fs.existsSync(ordersDir)) {
  fs.mkdirSync(ordersDir);
}

// Routes
app.use('/shopify', webhookRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
