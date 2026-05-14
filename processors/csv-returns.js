const fs = require("fs");
const path = require("path");

const INPUT_DIR = "input";
const OUTPUT_FILE = "output/returns.json";

function parseCSV(content) {
  const lines = content.split("\n").filter(l => l.trim());
  const headers = lines[0].split(",");

  return lines.slice(1).map(line => {
    const values = line.split(",");
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = values[i]?.trim());
    return obj;
  });
}

function runProcessor() {
  console.log("?? Running CSV Returns Processor");

  if (!fs.existsSync(INPUT_DIR)) {
    console.log("No input folder found");
    return;
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith(".csv"));

  if (files.length === 0) {
    console.log("No CSV files found");
    return;
  }

  let allRows = [];

  for (const file of files) {
    const fullPath = path.join(INPUT_DIR, file);
    console.log("Processing:", file);

    const content = fs.readFileSync(fullPath, "utf8");
    const rows = parseCSV(content);
    allRows.push(...rows);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allRows, null, 2));
  console.log("? Returns saved to output/returns.json");
}

runProcessor();
