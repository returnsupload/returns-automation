const fs = require('fs');
const path = require('path');

function exportToNetSuite(rows) {
  if (!rows || rows.length === 0) {
    console.log("No rows to export.");
    return;
  }

  const outputDir = path.join(__dirname, '..', 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputFile = path.join(outputDir, 'netsuite_returns_upload.csv');

  const headers = [
    'Marketplace',
    'Order ID',
    'SKU',
    'Reason',
    'Quantity'
  ];

  const csvLines = [];
  csvLines.push(headers.join(','));

  rows.forEach(r => {
    csvLines.push([
      r.marketplace || '',
      r.order_id || '',
      r.sku || '',
      r.reason || '',
      r.quantity || 1
    ].join(','));
  });

  fs.writeFileSync(outputFile, csvLines.join('\n'));

  console.log('\nNetSuite upload file created:');
  console.log(outputFile);
}

module.exports = { exportToNetSuite };