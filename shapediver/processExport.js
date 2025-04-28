const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Directory to save exports
const exportsDir = path.join(__dirname, '..', 'exports');

async function processExport(exportResult, exportId, lineItemId) {
  const expObj = exportResult.exports[exportId];
  const contentItem = expObj.content && expObj.content[0];

  if (contentItem && contentItem.href) {
    const downloadUrl = contentItem.href;
    const originalFilename = expObj.filename
    const fileName = `${lineItemId} - ${originalFilename}`;

    // ensure exports directory exists
    fs.mkdirSync(exportsDir, { recursive: true });

    console.log('Trying to download and save file...');
    console.log('URL:', downloadUrl);
    console.log('Original Filename:', originalFilename);
    console.log('Saving Filename:', fileName);

    try {
      // Use Fetch API (Node.js 20+)
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(exportsDir, fileName);

      await fs.promises.writeFile(filePath, buffer);
      console.log(`File downloaded and saved to ${filePath}`);
    } catch (err) {
      console.error('Error downloading file:', err);
      throw err;
    }
  } else {
    console.error('No downloadable content found in exportResult.exports for', exportId);
    throw new Error('No downloadable content found');
  }
}

module.exports = { processExport };
