const fs = require("fs");
const { google } = require("googleapis");

async function main() {
  const credentials = JSON.parse(fs.readFileSync("credentials.json"));
  const token = JSON.parse(fs.readFileSync("token.json"));

  const { client_secret, client_id, redirect_uris } =
    credentials.installed || credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  oAuth2Client.setCredentials(token);

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 5,
  });

  console.log("📬 Messages found:", res.data.messages?.length || 0);

  if (!res.data.messages) return;

  for (const msg of res.data.messages) {
    const full = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });

    const headers = full.data.payload.headers;
    const subject = headers.find(h => h.name === "Subject")?.value;
    const from = headers.find(h => h.name === "From")?.value;

    console.log("----");
    console.log("From:", from);
    console.log("Subject:", subject);
  }
}

main();