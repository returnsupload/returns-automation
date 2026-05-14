const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");

const app = express();

// Session storage for OAuth tokens
app.use(session({
  secret: "openclaw_secret_key",
  resave: false,
  saveUninitialized: true
}));

// Load Google credentials from JSON file
const credentials = require("./client_secret.json").installed;

const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  "http://localhost:3000/auth/google/callback"
);

// ==============================
// STEP 1 — LOGIN WITH GOOGLE
// ==============================
app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly"
    ]
  });

  res.redirect(url);
});

// ==============================
// STEP 2 — GOOGLE CALLBACK
// ==============================
app.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens } = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(tokens);
    req.session.tokens = tokens;

    res.send("? Gmail connected successfully! Go to /emails");
  } catch (err) {
    console.error(err);
    res.send("OAuth failed");
  }
});

// ==============================
// STEP 3 — READ EMAILS
// ==============================
app.get("/emails", async (req, res) => {
  if (!req.session.tokens) {
    return res.send("? Please login first ? http://localhost:3000/auth/google");
  }

  oauth2Client.setCredentials(req.session.tokens);
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const result = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10
  });

  res.json(result.data);
});

// ==============================
app.listen(3000, () => {
  console.log("?? Gmail OAuth Server running");
  console.log("?? Open http://localhost:3000/auth/google");
});
