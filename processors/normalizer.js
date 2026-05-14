// processors/normalizer.js

function normalizeAmazon(rows) {
  return rows.map(r => ({
    marketplace: "Amazon",
    order_id: r["order-id"] || r["Order ID"] || "",
    sku: r["sku"] || r["SKU"] || "",
    reason: r["reason"] || r["Return Reason"] || "",
    quantity: Number(r["quantity"] || r["Qty"] || 1)
  }));
}

function normalizeEbay(rows) {
  return rows.map(r => ({
    marketplace: "eBay",
    order_id: r["Order number"] || r["Order ID"] || "",
    sku: r["SKU"] || "",
    reason: r["Return Reason"] || "",
    quantity: Number(r["Qty"] || 1)
  }));
}

function normalizeWalmart(rows) {
  return rows.map(r => ({
    marketplace: "Walmart",
    order_id: r["purchaseOrderId"] || "",
    sku: r["Item SKU"] || "",
    reason: r["returnReason"] || "",
    quantity: Number(r["quantity"] || 1)
  }));
}

function normalizeRows(marketplace, rows) {
  if (marketplace === "Amazon") return normalizeAmazon(rows);
  if (marketplace === "eBay") return normalizeEbay(rows);
  if (marketplace === "Walmart") return normalizeWalmart(rows);
  return [];
}

module.exports = { normalizeRows };