const express = require('express');
const cors = require('cors');
const db = require('./database'); // Database connection

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint to fetch all jobs
app.get('/api/jobs', (req, res) => {
    const query = `SELECT * FROM jobs`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// API endpoint to add a job
app.post('/api/jobs', (req, res) => {
    const { title, companyName, applicationDate, applicationStatus, interviewDate } = req.body;

    if (!title || !companyName || !applicationDate || !applicationStatus) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const query = `
        INSERT INTO jobs (title, companyName, applicationDate, applicationStatus, interviewDate)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [title, companyName, applicationDate, applicationStatus, interviewDate], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, title, companyName, applicationDate, applicationStatus, interviewDate });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
