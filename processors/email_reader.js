const imaps = require("imap-simple");
const fs = require("fs");
const path = require("path");
const { simpleParser } = require("mailparser");

const downloadFolder = path.join(__dirname, "..", "input");

const config = {
  imap: {
    user: "openclawreturns@gmail.com",
    password: "quts evfk gxet gxom",
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    authTimeout: 10000,
    tlsOptions: {
      rejectUnauthorized: false
    }
  }
};

async function downloadAttachments() {
  console.log("📬 Connecting to Gmail...");

  const connection = await imaps.connect(config);
  await connection.openBox("INBOX");

  const searchCriteria = ['UNSEEN'];
  const fetchOptions = { bodies: [''], markSeen: true };

  const messages = await connection.search(searchCriteria, fetchOptions);

  console.log(`📥 ${messages.length} new email(s) found`);

  for (const message of messages) {
    const all = message.parts.find(part => part.which === '');
    const parsed = await simpleParser(all.body);

    if (!parsed.attachments.length) {
      console.log("⚠️ Email has no attachments");
      continue;
    }

    for (const attachment of parsed.attachments) {
      const filePath = path.join(downloadFolder, attachment.filename);
      fs.writeFileSync(filePath, attachment.content);
      console.log("📎 Saved attachment:", attachment.filename);
    }
  }

  connection.end();
}

module.exports = { downloadAttachments };