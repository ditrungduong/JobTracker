const db = require('./database'); // Import the database connection

const jobs = [
    {
        title: 'Software Engineer',
        companyName: 'Google',
        applicationDate: '2025-01-01',
        applicationStatus: 'Submitted',
        interviewDate: '2025-01-10',
        skills: ['JavaScript', 'React', 'Node.js'],
        contact_name: 'George Harrison',
        contact_email: 'GeorgeHarrison@gmail.com',
        contact_phone: '555-1234-6666',
    },
    {
        title: 'Data Scientist',
        companyName: 'Meta',
        applicationDate: '2025-01-03',
        applicationStatus: 'In Review',
        interviewDate: '2025-01-12',
        skills: ['Python', 'Machine Learning', 'SQL'],
        contact_name: 'John Lennon',
        contact_email: 'john.lennon@meta.com',
        contact_phone: '555-5678-1111',
    },
    {
        title: 'Backend Developer',
        companyName: 'Amazon',
        applicationDate: '2025-01-05',
        applicationStatus: 'Interview Scheduled',
        interviewDate: '2025-01-15',
        skills: ['Java', 'Spring Boot', 'AWS'],
        contact_name: 'Ringo Starr',
        contact_email: 'Ringo@amazon.com',
        contact_phone: '555-9876-2321',
    },
];

db.serialize(() => {
    jobs.forEach((job) => {
        db.run(
            `INSERT INTO jobs (title, companyName, applicationDate, applicationStatus, interviewDate, skills, contact_name, contact_email, contact_phone) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                job.title,
                job.companyName,
                job.applicationDate,
                job.applicationStatus,
                job.interviewDate,
                JSON.stringify(job.skills),
                job.contact_name,
                job.contact_email,
                job.contact_phone
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
