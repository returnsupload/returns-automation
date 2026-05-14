const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const CLIENT_ID = "PASTE_CLIENT_ID_HERE";
const CLIENT_SECRET = "PASTE_CLIENT_SECRET_HERE";
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob";

const auth = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

auth.setCredentials(JSON.parse(fs.readFileSync("token.json")));

const gmail = google.gmail({ version: "v1", auth });

const INPUT_DIR = path.join(__dirname, "input");
if (!fs.existsSync(INPUT_DIR)) fs.mkdirSync(INPUT_DIR);

async function downloadAttachments() {
  console.log("Connecting to Gmail...");

  const res = await gmail.users.messages.list({
    userId: "me",
    q: "has:attachment newer_than:5d",
    maxResults: 20
  });

  if (!res.data.messages) {
    console.log("No emails found.");
    return;
  }

  console.log("Emails found:", res.data.messages.length);

  for (const msg of res.data.messages) {
    const fullMessage = await gmail.users.messages.get({
      userId: "me",
      id: msg.id
    });

    const parts = fullMessage.data.payload.parts || [];

    for (const part of parts) {
      if (!part.filename || !part.body || !part.body.attachmentId)
        continue;

      const attachment = await gmail.users.messages.attachments.get({
        userId: "me",
        messageId: msg.id,
        id: part.body.attachmentId
      });

      const buffer = Buffer.from(attachment.data.data, "base64");
      const savePath = path.join(INPUT_DIR, part.filename);

      if (fs.existsSync(savePath)) {
        console.log("Duplicate skipped:", part.filename);
        continue;
      }

      fs.writeFileSync(savePath, buffer);
      console.log("Downloaded:", part.filename);
    }
  }
}

async function runPipeline() {
  console.log("Starting OpenClaw Returns Automation");
  await downloadAttachments();
  console.log("Running returns parser...");
  require("./index.js");
  console.log("Automation complete");
}

runPipeline().catch(err => console.error(err));
