import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    // State for storing the list of jobs
    const [jobs, setJobs] = useState([]); 
    
    // State for handling new job input
    const [jobTitle, setJobTitle] = useState(''); 
    
    // State for managing the job being edited
    const [editingJob, setEditingJob] = useState(null); 
    
    // State for handling the input for editing a job title
    const [editTitle, setEditTitle] = useState(''); 

    // Fetch jobs from the backend when the component is first loaded
    useEffect(() => {
        fetchJobs(); // Call the function to fetch the list of jobs
    }, []);

    /**
     * Fetches the list of jobs from the backend API.
     * Updates the `jobs` state with the data retrieved.
     */
    const fetchJobs = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/jobs'); // Fetch all jobs
            const data = await response.json(); // Parse the JSON response
            setJobs(data); // Update the `jobs` state
        } catch (error) {
            console.error('Failed to fetch jobs:', error); // Log any errors
        }
    };

    /**
     * Adds a new job to the list.
     * Sends the job title to the backend and updates the UI with the new job.
     */
    const addJob = async () => {
        if (jobTitle.trim() === '') return; // Ignore empty input
        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: jobTitle }), // Send job title to backend
            });
            const newJob = await response.json(); // Get the newly created job
            setJobs([...jobs, newJob]); // Add it to the local job list
            setJobTitle(''); // Clear the input field
        } catch (error) {
            console.error('Failed to add job:', error); // Log any errors
        }
    };

    /**
     * Starts the editing process for a specific job.
     * Updates the `editingJob` and `editTitle` states.
     */
    const startEditing = (job) => {
        setEditingJob(job.id); // Set the job ID to edit
        setEditTitle(job.title); // Populate the input with the existing job title
    };

    /**
     * Updates an existing job with a new title.
     * Sends the updated title to the backend and refreshes the UI.
     */
    const updateJob = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${editingJob}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle }), // Send updated title
            });
            if (response.ok) {
                setJobs(
                    jobs.map((job) =>
                        job.id === editingJob ? { ...job, title: editTitle } : job
                    )
                );
                setEditingJob(null); // Exit edit mode
                setEditTitle(''); // Clear edit input
            }
        } catch (error) {
            console.error('Failed to update job:', error); // Log any errors
        }
    };

    /**
     * Deletes a job from the list.
     * Sends a request to the backend to remove the job and updates the UI.
     */
    const deleteJob = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/jobs/${id}`, { method: 'DELETE' }); // Send delete request
            setJobs(jobs.filter((job) => job.id !== id)); // Remove job from local list
        } catch (error) {
            console.error('Failed to delete job:', error); // Log any errors
        }
    };

    return (
        <div className="container">
            <h1>Job Tracker</h1>

            {/* Add Job Section */}
            <div className="input-container">
                <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter a job title"
                />
                <button onClick={addJob}>Add Job</button>
            </div>

            {/* Job List Section */}
            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        {editingJob === job.id ? (
                            // Editing Mode: Show input and save/cancel buttons
                            <>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                                <button onClick={updateJob}>Save</button>
                                <button onClick={() => setEditingJob(null)}>Cancel</button>
                            </>
                        ) : (
                            // Normal Mode: Show job title with edit and delete buttons
                            <>
                                <span>{job.title}</span>
                                <button onClick={() => startEditing(job)}>Edit</button>
                                <button onClick={() => deleteJob(job.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
