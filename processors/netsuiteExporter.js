// processors/netsuiteExporter.js
const fs = require("fs");
const path = require("path");

function exportToNetSuite(returns) {
  if (!returns || returns.length === 0) {
    console.log("No returns to export.");
    return;
  }

  const outputFolder = path.join(__dirname, "..", "output");
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const outputFile = path.join(outputFolder, "netsuite_returns_upload.csv");

  const headers = [
    "Date",
    "Order Number",
    "SKU",
    "Qty",
    "Return Reason",
    "Marketplace"
  ];

  const rows = returns.map(r => [
    new Date().toISOString().split("T")[0],
    r.order_id,
    r.sku,
    r.quantity,
    r.reason,
    r.marketplace
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(r => r.join(","))
  ].join("\n");

  fs.writeFileSync(outputFile, csvContent);

  console.log("\nNetSuite upload file created:");
  console.log(outputFile);
}

module.exports = { exportToNetSuite };