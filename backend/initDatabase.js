const sqlite3 = require('sqlite3').verbose();

// Initialize the database and create tables if they don't exist
const db = new sqlite3.Database('./jobs.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error creating the jobs table:', err.message);
        } else {
            console.log('Jobs table created or verified.');
        }
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing the database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
});
