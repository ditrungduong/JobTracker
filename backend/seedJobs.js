const db = require('./database'); // Import the database connection

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

db.serialize(() => {
    jobs.forEach((job) => {
        db.run(
            `INSERT INTO jobs (title, companyName, applicationDate, applicationStatus, interviewDate, skills) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                job.title,
                job.companyName,
                job.applicationDate,
                job.applicationStatus,
                job.interviewDate,
                JSON.stringify(job.skills), // Serialize skills as JSON
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
});

db.close(() => {
    console.log('Database connection closed.');
});
