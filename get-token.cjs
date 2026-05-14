const fs = require("fs");
const http = require("http");
const { google } = require("googleapis");

const CLIENT_ID = "911889764482-s079efd2qs15q9eq7qqpje1hg1cfj51m.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000";

const auth = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];

const url = auth.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent"
});

console.log("\nOpening browser for Google login...\n");
console.log(url);

http.createServer(async (req, res) => {
  const urlParts = new URL(req.url, "http://localhost:3000");
  const code = urlParts.searchParams.get("code");

  if (!code) return;

  res.end("Authorization successful! You can close this tab.");

  const { tokens } = await auth.getToken(code);
  fs.writeFileSync("token.json", JSON.stringify(tokens));
  console.log("token.json saved! 🎉");

  process.exit();
}).listen(3000);