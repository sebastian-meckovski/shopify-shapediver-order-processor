// Endpoint to handle the Shopify webhook
app.post('/shopify/webhook', (req, res) => {
    const orderData = req.body;
  
    // Create a unique file name based on timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filePath = path.join(ordersDir, `order-${timestamp}.json`);
  
    // Write the webhook data to a file
    fs.writeFile(filePath, JSON.stringify(orderData, null, 2), (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return res.status(500).send('Error saving order data');
      }
  
      console.log('Order data saved to:', filePath);
      res.status(200).send('Webhook received and order data saved');
    });
  });
  
  // Start the server
  const PORT = 3015;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });