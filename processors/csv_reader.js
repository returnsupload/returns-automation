const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const INPUT_DIR = path.join(__dirname, '..', 'input');

async function readAllCSVs() {
    return new Promise((resolve) => {
        const results = [];
        const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.csv'));

        if (files.length === 0) {
            console.log('No CSV files found.');
            resolve([]);
            return;
        }

        let pending = files.length;

        files.forEach(file => {
            const rows = [];
            fs.createReadStream(path.join(INPUT_DIR, file))
                .pipe(csv())
                .on('data', data => rows.push(data))
                .on('end', () => {
                    results.push({ file, rows });
                    pending--;
                    if (pending === 0) resolve(results);
                });
        });
    });
}

module.exports = { readAllCSVs };