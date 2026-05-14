// processors/netsuite_exporter.js

const fs = require("fs");
const path = require("path");

const OUTPUT_DIR = path.join(__dirname, "..", "output");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "netsuite_returns_upload.csv");

function exportToNetSuite(rows) {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  const headers = [
    "Marketplace",
    "Order ID",
    "SKU",
    "Reason",
    "Quantity"
  ];

  const csvLines = [headers.join(",")];

  rows.forEach(r => {
    csvLines.push([
      r.marketplace,
      r.order_id,
      r.sku,
      r.reason,
      r.quantity
    ].join(","));
  });

  fs.writeFileSync(OUTPUT_FILE, csvLines.join("\n"));

  console.log("\nNetSuite upload file created:");
  console.log(OUTPUT_FILE);
}

module.exports = { exportToNetSuite };