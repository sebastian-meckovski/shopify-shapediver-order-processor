const fs = require("fs");
const path = require("path");
const { createShapediverSession } = require("../shapediver/createSession");
const { createShapediverExport } = require("../shapediver/createExport");
const { processExport } = require("../shapediver/processExport");

const ordersDir = path.join(__dirname, "..", "orders");

function saveOrder(orderData) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.join(ordersDir, `order-${timestamp}.json`);

  fs.writeFile(filePath, JSON.stringify(orderData, null, 2), (err) => {
    if (err) {
      return console.error("Error writing file:", err);
    }
    console.log("Order data saved to:", filePath);
  });
}

async function processOrder(orderData) {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN; // Replace with your actual token
  const shop = "rar1g1-wc.myshopify.com";
  const apiVersion = "2025-01";

  if (orderData.line_items && Array.isArray(orderData.line_items)) {
    for (const item of orderData.line_items) {
      console.log(`Line Item: ${item.name}`);
      const modelStateProp = item.properties?.find((p) => p.name === "modelStateId");

      if (modelStateProp) {
        console.log(`  modelStateId: ${modelStateProp.value}`);
      } else {
        console.log(`  modelStateId: Not found`);
      }

      const productId = item.product_id;

      if (productId) {
        try {
          const url = `https://${shop}/admin/api/${apiVersion}/products/${productId}/metafields.json?namespace=custom&key=ticketid`;
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(
              `Failed to fetch metafield for product ${productId} - ${response.status}`
            );
          }

          const data = await response.json();
          const ticketId = data.metafields?.[0]?.value;

          if (ticketId) {
            console.log(`  ticketid: ${ticketId}`);
          } else {
            console.log(`  ticketid: Not found`);
          }

          const shapediverSession = await createShapediverSession(ticketId, modelStateProp.value)
            .then(async (response) => {
              if (!response.ok) {
                const err = await response.json();
                throw new Error(`${err.message} (${err.error})`);
              }
              return response.json();
            })
            .catch((err) => console.error(err));

          // 1. sessionId is right on the root
          const sessionId = shapediverSession.sessionId;

          // 2. parameters live under modelState.parameters
          const parameters = shapediverSession.modelState.parameters;

          // 3. exportId is the key of the single property under `exports`
          const exportKeys = Object.keys(shapediverSession.exports);
          const exportId = exportKeys.length > 0 ? exportKeys[0] : null;

          try {
            const exportResponse = await createShapediverExport(sessionId, exportId, parameters);
            if (!exportResponse.ok) {
              const errorBody = await exportResponse.json();
              throw new Error(`${errorBody.message} (${errorBody.error})`);
            }
            const exportResult = await exportResponse.json();

            // save file from exportResult
            // locate download URL and filename
            const expObj = exportResult.exports[exportId];
            const contentItem = expObj.content && expObj.content[0];
            if (contentItem && contentItem.href) {
              await processExport(exportResult, exportId, item.id);

            } else {
              console.error("No downloadable content found in exportResult.exports for", exportId);
            }
            console.log("Export result:", exportResult);
          } catch (exportErr) {
            console.error("Export error:", exportErr);
          }
        } catch (err) {
          console.error(`Error fetching metafield for product ${productId}:`, err);
        }
      } else {
        console.log(`  product_id not available for line item`);
      }
    }
  }
}

module.exports = {
  saveOrder,
  processOrder,
};
