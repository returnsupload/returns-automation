const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
const TOKEN_PATH = "token.json";
const CREDENTIALS_PATH = "credentials.json";

// ⭐ THIS is the important folder
const DOWNLOAD_DIR = path.join(__dirname, "input");

// create input folder if missing
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

// Load credentials
const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
const { client_secret, client_id, redirect_uris } = credentials.installed;

const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
);

// Load saved token
const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
oAuth2Client.setCredentials(token);

const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

async function downloadAttachments() {
    console.log("🔎 Searching Amazon return emails...");

    const res = await gmail.users.messages.list({
        userId: "me",
        q: "Amazon Returns has:attachment",
        maxResults: 10,
    });

    const messages = res.data.messages || [];
    console.log("📨 Found emails:", messages.length);

    for (const msg of messages) {
        const message = await gmail.users.messages.get({
            userId: "me",
            id: msg.id,
        });

        const parts = message.data.payload.parts || [];

        for (const part of parts) {
            if (part.filename && part.body.attachmentId) {
                const attachment = await gmail.users.messages.attachments.get({
                    userId: "me",
                    messageId: msg.id,
                    id: part.body.attachmentId,
                });

                const fileData = attachment.data.data;
                const buffer = Buffer.from(fileData, "base64");

                const filePath = path.join(DOWNLOAD_DIR, part.filename);
                fs.writeFileSync(filePath, buffer);

                console.log("✅ Saved:", part.filename);
            }
        }
    }

    console.log("🎉 Finished!");
}

downloadAttachments();