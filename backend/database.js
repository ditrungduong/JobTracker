const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database (or create one if it doesn't exist)
const db = new sqlite3.Database('./jobs.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase(); // Ensure the schema is created
    }
});

/**
 * Function to initialize the database schema
 * Ensures that all necessary tables and fields are created
 */
const initializeDatabase = () => {
    db.serialize(() => {
        db.run(
            `CREATE TABLE IF NOT EXISTS jobs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                companyName TEXT NOT NULL,
                applicationDate TEXT NOT NULL,
                applicationStatus TEXT NOT NULL,
                interviewDate TEXT,
                skills TEXT,
                contact_name TEXT,
                contact_email TEXT,
                contact_phone TEXT
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating jobs table:', err.message);
                } else {
                    console.log('Jobs table ensured.');
                }
            }
        );

        db.run(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating users table:', err.message);
                } else {
                    console.log('Users table ensured.');
                }
            }
        );

    });
};

// Export the database connection
module.exports = db;
