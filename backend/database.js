const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (or create one if it doesn't exist)
const db = new sqlite3.Database('./jobs.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create the jobs table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
        )
    `);
});

module.exports = db;
