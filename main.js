const { execSync } = require("child_process");
const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

async function getAuthClient() {
  const auth = new GoogleAuth({
    keyFile: "service-account.json",
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/gmail.readonly"
    ],
  });
  return await auth.getClient();
}

async function runPipeline() {
  console.log("?? START RETURNS PIPELINE");

  console.log("?? Step 1: Download Gmail attachments");
  execSync("node gmail-download.js", { stdio: "inherit" });

  console.log("?? Step 2: Run processors");
  execSync("node run-all.js", { stdio: "inherit" });

  console.log("?? Step 3: Upload to Google Sheets");
  execSync("node sheets-writer.js", { stdio: "inherit" });

  console.log("?? PIPELINE FINISHED");
}

runPipeline();
