const express = require('express');
const cors = require('cors');
const db = require('./database'); // Database connection

const app = express();
app.use(cors());
app.use(express.json());

const bcrypt = require('bcrypt'); // needed for password encryption
const saltRounds = 10; // needed for password encryption

// API endpoint to fetch all jobs
app.get('/api/jobs', (req, res) => {
    const query = `SELECT * FROM jobs`;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Parse the `skills` field from JSON string to an array
        const jobs = rows.map((row) => ({
            ...row,
            skills: row.skills ? JSON.parse(row.skills) : [],
        }));

        res.json(jobs);
    });
});

// API endpoint to add a job
app.post('/api/jobs', (req, res) => {
    const { title, companyName, applicationDate, applicationStatus, interviewDate, skills } = req.body;

    if (!title || !companyName || !applicationDate || !applicationStatus) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const query = `
        INSERT INTO jobs (title, companyName, applicationDate, applicationStatus, interviewDate, skills)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(
        query,
        [
            title,
            companyName,
            applicationDate,
            applicationStatus,
            interviewDate || null,
            JSON.stringify(skills || []), // Convert skills array to JSON string
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                id: this.lastID,
                title,
                companyName,
                applicationDate,
                applicationStatus,
                interviewDate,
                skills,
            });
        }
    );
});

// API endpoint to update a job
app.put('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const { title, companyName, applicationDate, applicationStatus, interviewDate, skills } = req.body;

    // Validate required fields
    if (!title || !companyName || !applicationDate || !applicationStatus) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const query = `
        UPDATE jobs
        SET title = ?, companyName = ?, applicationDate = ?, applicationStatus = ?, interviewDate = ?, skills = ?
        WHERE id = ?
    `;

    db.run(
        query,
        [
            title,
            companyName,
            applicationDate,
            applicationStatus,
            interviewDate || null,
            JSON.stringify(skills || []), // Convert skills array to JSON string
            id,
        ],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Job not found' });
            }

            res.json({
                id,
                title,
                companyName,
                applicationDate,
                applicationStatus,
                interviewDate,
                skills,
            });
        }
    );
});

// API endpoint to delete a job
app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM jobs WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.json({ message: 'Job deleted successfully' });
    });
});

// API endpoint to update the password (hash it before storing)
app.put('/api/password', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password must be provided.' });
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password.' });
        }

        const query = `UPDATE authorization SET password = ? WHERE id = 1`;
        db.run(query, [hash], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Password not found or no changes made' });
            }

            res.json({ message: 'Password updated and hashed successfully.' });
        });
    });
});

// API endpoint to verify the password
app.post('/api/verify-password', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ error: 'Password must be provided.' });
    }

    const query = `SELECT password FROM authorization LIMIT 1`;
    db.get(query, [], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'Password not set.' });
        }

        // Compare the provided password with the stored hash
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error verifying password.' });
            }

            if (result) {
                // Password is correct
                res.json({ success: true, message: 'Password verified.' });
            } else {
                // Password is incorrect
                res.status(401).json({ success: false, message: 'Invalid password.' });
            }
        });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
