const { readAllCSVs } = require("./processors/csv_reader");
const { writeToSheets } = require("./processors/google_sheets");

async function main() {
  const csvFiles = await readAllCSVs();

  let rows = [];

  csvFiles.forEach(file => {
    file.rows.forEach(r => {
      rows.push({
        order_id: r["Order ID"] || r["order_id"] || "",
        customer: r["Customer"] || r["buyer"] || "",
        sku: r["SKU"] || r["sku"] || "",
        reason: r["Reason"] || r["reason"] || "",
        marketplace: file.file
      });
    });
  });

  console.log("Uploading rows:", rows.length);
  await writeToSheets(rows);
}

main();