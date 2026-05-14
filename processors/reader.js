const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const iconv = require("iconv-lite");
const { exportToNetSuite } = require("../exporters/netsuite_exporter");

const INPUT_DIR = path.join(__dirname, "..", "input");

function detectMarketplace(filename) {
  if (filename.includes("amazon")) return "Amazon";
  if (filename.includes("ebay")) return "eBay";
  if (filename.includes("walmart")) return "Walmart";
  return "Unknown";
}

function cleanObjectKeys(row) {
  const cleaned = {};
  for (let key in row) {
    const cleanKey = key.replace(/\0/g, "").trim().toLowerCase();
    cleaned[cleanKey] = row[key].replace(/\0/g, "").trim();
  }
  return cleaned;
}

function normalizeRows(marketplace, rows) {
  return rows.map(row => {
    if (marketplace === "Amazon") {
      return {
        marketplace,
        order_id: row["order-id"],
        sku: row["sku"],
        reason: row["reason"],
        quantity: Number(row["quantity"] || 1)
      };
    }

    if (marketplace === "eBay") {
      return {
        marketplace,
        order_id: row["order number"],
        sku: row["sku"],
        reason: row["return reason"],
        quantity: Number(row["qty"] || 1)
      };
    }

    if (marketplace === "Walmart") {
      return {
        marketplace,
        order_id: row["purchaseorderid"],
        sku: row["item sku"],
        reason: row["returnreason"],
        quantity: Number(row["quantity"] || 1)
      };
    }
  });
}

function readCsvSmart(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    // ⭐ decode UTF-16 → UTF-8
    const stream = fs
      .createReadStream(filePath)
      .pipe(iconv.decodeStream("utf16-le"))
      .pipe(csv());

    stream.on("data", (row) => {
      const cleanRow = cleanObjectKeys(row);
      rows.push(cleanRow);
    });

    stream.on("end", () => resolve(rows));
    stream.on("error", reject);
  });
}

async function readAllReturns() {
  console.log("Scanning input folder...\n");

  const files = fs.readdirSync(INPUT_DIR);
  let allNormalized = [];

  for (const file of files) {
    const filePath = path.join(INPUT_DIR, file);
    const marketplace = detectMarketplace(file);

    console.log(`Found file: ${file} → ${marketplace}`);

    const rows = await readCsvSmart(filePath);
    console.log(`Rows detected: ${rows.length}`);

    const normalized = normalizeRows(marketplace, rows);
    console.log(`Normalized rows: ${normalized.length}\n`);

    allNormalized = allNormalized.concat(normalized);
  }

  console.log("TOTAL NORMALIZED RETURNS:", allNormalized.length);
  console.log(allNormalized);

  exportToNetSuite(allNormalized);
}

module.exports = { readAllReturns };