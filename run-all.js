const { execSync } = require("child_process");

console.log("Running processors...");
execSync("node processors/csv-returns.js", { stdio: "inherit" });
console.log("Processors finished.");
