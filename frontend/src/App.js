import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // State for job list
    const [jobs, setJobs] = useState([]);

    // State for new job form
    const [newJob, setNewJob] = useState({
        companyName: '',
        title: '', 
        applicationDate: '',
        applicationStatus: '',
        interviewDate: '',
    });

    // State for error messages
    const [error, setError] = useState('');

     // State for editing jobes
    const [editingJob, setEditingJob] = useState(null);

    // Fetch jobs from the backend when the component is first loaded
    useEffect(() => {
        fetchJobs();
    }, []);

    // Fetch all jobs from the backend
    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/jobs');
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            setJobs(data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError('Unable to fetch jobs. Please try again later.');
        }
    };

    // Handle input changes for the new job form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewJob({ ...newJob, [name]: value });
    };

    // Add a new job
    const addJob = async () => {
        const { title, companyName, applicationDate, applicationStatus } = newJob;

        // Validation
        if (!title || !companyName || !applicationDate || !applicationStatus) {
            alert('Please fill out all required fields before adding a job.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add job');
            }

            const createdJob = await response.json();
            setJobs([...jobs, createdJob]); // Update the job list with the new job
            setNewJob({
                companyName: '',
                title: '', // Clear title field
                applicationDate: '',
                applicationStatus: '',
                interviewDate: '',
            }); // Clear the form
        } catch (error) {
            console.error('Error adding job:', error.message);
            setError(error.message || 'Unable to add job. Please try again later.');
        }
    };


    const startEditing = (job) => {
        setEditingJob(job.id);
        setNewJob(job); // Pre-fill form with job data
    };

    const updateJob = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${editingJob}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newJob),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to edit job');
            }

            const updateJobInList = (jobs, updatedJob, editingJob) => 
                jobs.map((job) => job.id === editingJob ? { ...job, ...updatedJob } : job);
            
            setJobs(updateJobInList(jobs, newJob, editingJob));// Update the job list with the edited job

            setEditingJob(null); // Clear edit section
            setNewJob({
                companyName: '',
                title: '',
                applicationDate: '',
                applicationStatus: '',
                interviewDate: '',
            });
        } catch (error) {
            setError('Unable to edit job. Please try again later.');
        }
    };

    const cancelEditing = () => {
        setEditingJob(null); // Clear edit section
        setNewJob({
            companyName: '',
            title: '',
            applicationDate: '',
            applicationStatus: '',
            interviewDate: '',
        });
    };

    return (
        <div className="container">
            <h1>Job Tracker</h1>

            {/* Display any error messages */}
            {error && <div className="error-message">{error}</div>}

            {/* Add Job Form */}
            <div className="input-container">
                <input
                    type="text"
                    name="companyName"
                    value={newJob.companyName}
                    onChange={handleInputChange}
                    placeholder="Company Name"
                />
                <input
                    type="text"
                    name="title" 
                    value={newJob.title}
                    onChange={handleInputChange}
                    placeholder="Job Title"
                />
                <input
                    type="date"
                    name="applicationDate"
                    value={newJob.applicationDate}
                    onChange={handleInputChange}
                    placeholder="Application Date"
                />
                <select
                    name="applicationStatus"
                    value={newJob.applicationStatus}
                    onChange={handleInputChange}
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
                    name="interviewDate"
                    value={newJob.interviewDate}
                    onChange={handleInputChange}
                    placeholder="Interview Date"
                    />
                    {editingJob ? (
                        <>
                            <button onClick={updateJob}>Save</button>
                            <button onClick={cancelEditing}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={addJob}>Add Job</button>
                    )}
                </div>

            {/* Job List */}
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <span>
                            <strong>Company:</strong> {job.companyName}
                        </span>
                        <span>
                            <strong>Job Title:</strong> {job.title} {/* Use title */}
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
                        <button onClick={() => startEditing(job)}>Edit</button>
                        <button
                            onClick={() => alert('Delete functionality to be implemented by teammates')}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
