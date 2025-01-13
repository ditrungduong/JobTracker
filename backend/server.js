const express = require('express');
const cors = require('cors');
const db = require('./database'); // Import the database connection

const app = express();
app.use(cors());
app.use(express.json());

// Add a job
app.post('/api/jobs', (req, res) => {
    const { title } = req.body;
    db.run('INSERT INTO jobs (title) VALUES (?)', [title], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID, title });
        }
    });
});

// View jobs
app.get('/api/jobs', (req, res) => {
    db.all('SELECT * FROM jobs', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Update a job
app.put('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    db.run('UPDATE jobs SET title = ? WHERE id = ?', [title, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Job not found' });
        } else {
            res.json({ id, title });
        }
    });
});

// Delete a job
app.delete('/api/jobs/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM jobs WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Job not found' });
        } else {
            res.status(204).send(); // No content
        }
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
