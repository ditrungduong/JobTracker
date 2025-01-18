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
                skills TEXT
            )`,
            (err) => {
                if (err) {
                    console.error('Error creating jobs table:', err.message);
                } else {
                    console.log('Jobs table ensured.');
                }
            }
        );
    });
};

// Export the database connection
module.exports = db;
