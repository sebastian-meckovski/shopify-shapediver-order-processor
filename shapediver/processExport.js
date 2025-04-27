const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Directory to save exports
const exportsDir = path.join(__dirname, '..', 'exports');

function generateUniqueFilename(originalFilename) {
  const uniqueId = crypto.randomUUID();
  return `${uniqueId}-${originalFilename}`;
}

async function processExport(exportResult, exportId) {
  const expObj = exportResult.exports[exportId];
  const contentItem = expObj.content && expObj.content[0];

  if (contentItem && contentItem.href) {
    const downloadUrl = contentItem.href;
    const originalFilename = expObj.filename || `export-${exportId}.${contentItem.format}`;
    const uniqueFilename = generateUniqueFilename(originalFilename);

    // ensure exports directory exists
    fs.mkdirSync(exportsDir, { recursive: true });

    console.log('Trying to download and save file...');
    console.log('URL:', downloadUrl);
    console.log('Original Filename:', originalFilename);
    console.log('Unique Filename:', uniqueFilename);

    try {
      // Use Fetch API (Node.js 20+)
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(exportsDir, uniqueFilename);

      await fs.promises.writeFile(filePath, buffer);
      console.log(`File downloaded and saved to ${filePath}`);
    } catch (err) {
      console.error('Error downloading file:', err);
    }
  } else {
    console.error('No downloadable content found in exportResult.exports for', exportId);
  }
}

module.exports = { processExport };
