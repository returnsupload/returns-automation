const { readAllCSVs } = require('./processors/csv_reader');
const { readAllPDFs } = require('./processors/pdf_reader');

async function run() {
  console.log("🚀 STARTING RETURNS AUTOMATION\n");

  // 1. Read CSV files
  const csvData = await readAllCSVs();
  console.log("\n📊 CSV FILES FOUND:");
  console.log(JSON.stringify(csvData, null, 2));

  // 2. Read PDFs (will be empty until PDFs exist)
  const pdfData = await readAllPDFs();
  console.log("\n📄 PDF FILES FOUND:");
  console.log(JSON.stringify(pdfData, null, 2));

  console.log("\n🎉 ALL DATA LOADED SUCCESSFULLY");
}

run();