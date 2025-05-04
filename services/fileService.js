const fs = require("fs").promises;
const path = require("path");

const ordersDir = path.join(__dirname, "..", "exports");

class FileService {
  static async findFileByLineItemId(lineItemId) {
    try {
      const files = await fs.readdir(ordersDir);

      const match = files.find(name =>
        name.startsWith(`${lineItemId}`)
      );

      if (!match) {
        return null;
      }

      const filePath = path.join(ordersDir, match);
      return { filePath, fileName: match };

    } catch (err) {
      console.error('Failed to process file search:', err);
      return null;
    }
  }
}

module.exports = FileService;
