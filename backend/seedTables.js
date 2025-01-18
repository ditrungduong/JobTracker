const db = require('./database'); // Import the database connection
const bcrypt = require('bcrypt'); // Used for encrypting the password
const saltRounds = 10; // Seed round required for bcrypt

const jobs = [
    {
        title: 'Software Engineer',
        companyName: 'Google',
        applicationDate: '2025-01-01',
        applicationStatus: 'Submitted',
        interviewDate: '2025-01-10',
        skills: ['JavaScript', 'React', 'Node.js'], // Add skills
    },
    {
        title: 'Data Scientist',
        companyName: 'Meta',
        applicationDate: '2025-01-03',
        applicationStatus: 'In Review',
        interviewDate: '2025-01-12',
        skills: ['Python', 'Machine Learning', 'SQL'], // Add skills
    },
    {
        title: 'Backend Developer',
        companyName: 'Amazon',
        applicationDate: '2025-01-05',
        applicationStatus: 'Interview Scheduled',
        interviewDate: '2025-01-15',
        skills: ['Java', 'Spring Boot', 'AWS'], // Add skills
    },
];

const insertHashedPassword = async () => {
    const plainTextPassword = 'abc123';
    try {
        const hash = await bcrypt.hash(plainTextPassword, saltRounds);
        db.run(
            // Use INSERT OR REPLACE to ensure only one password record exists
            `INSERT OR REPLACE INTO authorization (id, password) VALUES (1, ?)`,
            [hash],
            function (err) {
                if (err) {
                    console.error('Error inserting hashed password:', err.message);
                } else {
                    console.log('Hashed password added successfully.');
                }
            }
        );
    } catch (err) {
        console.error('Error hashing password:', err.message);
    }
};

db.serialize(() => {
    // Insert jobs
    jobs.forEach((job) => {
        db.run(
            `INSERT INTO jobs (title, companyName, applicationDate, applicationStatus, interviewDate, skills) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                job.title,
                job.companyName,
                job.applicationDate,
                job.applicationStatus,
                job.interviewDate,
                JSON.stringify(job.skills),
            ],
            function (err) {
                if (err) {
                    console.error('Error inserting job:', err.message);
                } else {
                    console.log(`Job added: ${job.title}`);
                }
            }
        );
    });

    // Insert hashed password
    insertHashedPassword().then(() => {
        db.close(() => {
            console.log('Database connection closed.');
        });
    });
});
