const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");

const ORDERS_DB = path.join(__dirname, "..", "data", "orders_database.csv");

function loadOrdersDatabase() {
  if (!fs.existsSync(ORDERS_DB)) {
    console.log("Orders database not found.");
    return [];
  }

  const content = fs.readFileSync(ORDERS_DB, "utf8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true
  });

  return records;
}

function matchReturnsToOrders(returnsList) {
  const orders = loadOrdersDatabase();

  const matched = [];
  const missing = [];

  returnsList.forEach(ret => {
    const found = orders.find(order => order.order_id === ret.order_id);

    if (found) {
      matched.push(ret);
    } else {
      missing.push(ret);
    }
  });

  console.log(`Matched returns: ${matched.length}`);
  console.log(`Missing orders: ${missing.length}`);

  return { matched, missing };
}

module.exports = { matchReturnsToOrders };