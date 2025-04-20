const fs = require('fs');
const path = require('path');

const ordersDir = path.join(__dirname, '..', 'orders');

function saveOrder(orderData) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filePath = path.join(ordersDir, `order-${timestamp}.json`);

  fs.writeFile(filePath, JSON.stringify(orderData, null, 2), (err) => {
    if (err) {
      return console.error('Error writing file:', err);
    }
    console.log('Order data saved to:', filePath);
  });
}

function processOrder(orderData) {
  if (orderData.line_items && Array.isArray(orderData.line_items)) {
    orderData.line_items.forEach(item => {
      console.log(`Line Item: ${item.name}`);
      const modelStateProp = item.properties?.find(p => p.name === 'modelStateId');
      if (modelStateProp) {
        console.log(`  modelStateId: ${modelStateProp.value}`);
      } else {
        console.log(`  modelStateId: Not found`);
      }
    });
  }
}

module.exports = {
  saveOrder,
  processOrder
};
