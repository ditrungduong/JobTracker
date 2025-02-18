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
            contact_name: row.contact_name || "",  // Ensure contacts are included
            contact_email: row.contact_email || "",
            contact_phone: row.contact_phone || "",
        }));

        res.json(jobs);
    });
});

app.post('/api/jobs', (req, res) => {
    const { 
        title, companyName, applicationDate, applicationStatus, interviewDate, 
        skills, contact_name, contact_email, contact_phone 
    } = req.body;

    console.log("Received job from frontend:", req.body); // Debugging line

    if (!title || !companyName || !applicationDate || !applicationStatus) {
        return res.status(400).json({ error: 'All required fields must be provided.' });
    }

    const query = `
        INSERT INTO jobs (title, companyName, applicationDate, applicationStatus, interviewDate, skills, contact_name, contact_email, contact_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        query,
        [
            title, 
            companyName, 
            applicationDate, 
            applicationStatus, 
            interviewDate || null, 
            JSON.stringify(skills || []), 
            contact_name || '', 
            contact_email || '', 
            contact_phone || ''
        ],
        function (err) {
            if (err) {
                console.error('Database insert error:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log("Job successfully inserted into DB with ID:", this.lastID);
            res.status(201).json({
                id: this.lastID,
                title,
                companyName,
                applicationDate,
                applicationStatus,
                interviewDate,
                skills,
                contact_name,
                contact_email,
                contact_phone
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

// Register a new user
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password.' });
        }

        const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
        db.run(query, [email, hash], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error creating account. Email might be taken.' });
            }
            res.json({ message: 'User registered successfully!' });
        });
    });
});

// Login a user
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const query = `SELECT id, password FROM users WHERE email = ?`;
    db.get(query, [email], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error verifying password.' });
            }

            if (result) {
                res.json({ success: true, message: 'Login successful.' });
            } else {
                res.status(401).json({ error: 'Invalid password.' });
            }
        });
    });
});

// API endpoint to update the password (hash it before storing)
app.put('/api/password', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and new password must be provided.' });
    }

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password.' });
        }

        const query = `UPDATE users SET password = ? WHERE email = ?`;
        db.run(query, [hash, email], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found or no changes made.' });
            }

            res.json({ message: 'Password updated successfully.' });
        });
    });
});

// API endpoint to verify the password
app.post('/api/verify-password', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password must be provided.' });
    }

    const query = `SELECT password FROM users WHERE email = ?`;
    db.get(query, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Compare the provided password with the stored hash
        bcrypt.compare(password, row.password, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error verifying password.' });
            }

            if (result) {
                res.json({ success: true, message: 'Password verified.' });
            } else {
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
