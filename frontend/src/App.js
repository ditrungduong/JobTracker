import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // State for storing the list of jobs
    const [jobs, setJobs] = useState([]); 

    // States for adding a new job
    const [companyName, setCompanyName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [applicationDate, setApplicationDate] = useState('');
    const [applicationStatus, setApplicationStatus] = useState('');
    const [interviewDate, setInterviewDate] = useState('');

    // Fetch jobs from the backend when the component is first loaded
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/jobs'); // Fetch all jobs
            const data = await response.json(); // Parse the JSON response
            setJobs(data); // Update the `jobs` state
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        }
    };

    const addJob = async () => {
        if (!companyName || !jobTitle || !applicationDate || !applicationStatus) return;
        const newJob = {
            companyName,
            jobTitle,
            applicationDate,
            applicationStatus,
            interviewDate,
        };
        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob),
            });
            const createdJob = await response.json();
            setJobs([...jobs, createdJob]); // Add the new job to the jobs state
            setCompanyName(''); // Clear the form fields
            setJobTitle('');
            setApplicationDate('');
            setApplicationStatus('');
            setInterviewDate('');
        } catch (error) {
            console.error('Failed to add job:', error); // Log errors if any
        }
    };
    

    return (
        <div className="container">
            <h1>Job Tracker</h1>

            {/* Add Job Section */}
            <div className="input-container">
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Company Name"
                />
                <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Job Title"
                />
                <input
                    type="date"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                    placeholder="Application Date"
                />
                <select
                    value={applicationStatus}
                    onChange={(e) => setApplicationStatus(e.target.value)}
                >
                    <option value="">Select Status</option>
                    <option value="Submitted">Submitted</option>
                    <option value="In Review">In Review</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Offer Received">Offer Received</option>
                    <option value="Rejected">Rejected</option>
                </select>
                <input
                    type="date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                    placeholder="Interview Date"
                />
                <button onClick={addJob}>Add Job</button>
            </div>

            {/* Job List Section */}
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <span>
                            <strong>Company:</strong> {job.companyName}
                        </span>
                        <span>
                            <strong>Job Title:</strong> {job.jobTitle}
                        </span>
                        <span>
                            <strong>Application Date:</strong> {job.applicationDate}
                        </span>
                        <span>
                            <strong>Status:</strong> {job.applicationStatus}
                        </span>
                        <span>
                            <strong>Interview Date:</strong> {job.interviewDate}
                        </span>
                        {/* Placeholder for Edit button */}
                        <button onClick={() => alert('Edit functionality to be implemented')}>
                            Edit
                        </button>
                        {/* Placeholder for Delete button */}
                        <button onClick={() => alert('Delete functionality to be implemented')}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
