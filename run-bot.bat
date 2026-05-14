cd C:\dev\OpenClaw\returns-automation

echo Running Gmail download...
node gmail-download.js

echo Uploading to Google Sheets...
node main.js

echo Finished!