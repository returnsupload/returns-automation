const { downloadAttachments } = require("./processors/email_reader");
const { readAllReturns } = require("./processors/reader");
const { exportToNetSuite } = require("./exporters/netsuite_exporter");

async function run() {
  console.log("🔄 Starting Returns Automation...\n");

  // STEP 1 — Download email attachments
  await downloadAttachments();

  // STEP 2 — Process CSV / Excel / HTML returns
  const returns = await readAllReturns();

  // STEP 3 — Export NetSuite upload file
  exportToNetSuite(returns);

  console.log("\n✅ Automation finished!");
}

run().catch(err => {
  console.error("❌ Fatal error:", err);
});