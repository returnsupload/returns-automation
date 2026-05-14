const fs = require("fs");
const path = require("path");
const pdf = require("pdf-parse");

const INPUT_FOLDER = path.join(__dirname, "..", "input");

async function readAllPDFs() {
  console.log("📄 Reading PDF files...");

  const files = fs.readdirSync(INPUT_FOLDER);
  const pdfFiles = files.filter(file => file.endsWith(".pdf"));

  console.log("Found PDFs:", pdfFiles.length);

  let allTexts = [];

  for (const file of pdfFiles) {
    const filePath = path.join(INPUT_FOLDER, file);
    const dataBuffer = fs.readFileSync(filePath);

    try {
      const data = await pdf(dataBuffer);
      console.log("✅ Read:", file);

      allTexts.push({
        fileName: file,
        text: data.text
      });

    } catch (err) {
      console.log("❌ Failed reading:", file);
    }
  }

  return allTexts;
}

module.exports = { readAllPDFs };