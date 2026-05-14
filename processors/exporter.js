// processors/exporter.js

const fs = require("fs");
const path = require("path");

function exportToNetSuite(returns) {
  const OUTPUT_FOLDER = path.join(__dirname, "..", "output");

  if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER);
  }

  const outputFile = path.join(
    OUTPUT_FOLDER,
    "netsuite_returns_upload.csv"
  );

  // NetSuite CSV header
  const header =
    "Date,Order Number,SKU,Qty,Return Reason,Marketplace\n";

  const rows = returns.map(r =>
    `${new Date().toISOString().split("T")[0]},${r.order_id},${r.sku},${r.quantity},${r.reason},${r.marketplace}`
  );

  const csvContent = header + rows.join("\n");

  fs.writeFileSync(outputFile, csvContent);

  console.log("\nNetSuite upload file created:");
  console.log(outputFile);
}

module.exports = { exportToNetSuite };