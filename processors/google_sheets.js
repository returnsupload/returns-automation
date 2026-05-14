const { google } = require("googleapis");
const fs = require("fs");

const SPREADSHEET_ID = "1ZC1EipgMz9NiesOkeXZXzMAbzW_5zhODdC2d-aPoWUY";

async function writeToSheets(rows) {
  console.log("📤 Uploading to Google Sheets...");

  const auth = new google.auth.GoogleAuth({
    keyFile: "service-account.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const client = await auth.getClient();

  const values = [
    ["Order ID", "Customer", "Date", "Marketplace"],
    ...rows.map(r => [r.order_id, r.customer, r.date, r.marketplace])
  ];

  await sheets.spreadsheets.values.update({
    auth: client,
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: { values }
  });

  console.log("✅ Google Sheets updated!");
}

module.exports = { writeToSheets };