import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './Login';
import ChangePassword from './ChangePassword';

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
        skills: [], // Skills array for tag input
    });

    const [password, setPassword] = useState(''); // State for the login password
    const [currentPassword, setCurrentPassword] = useState(''); // State for the current password when changing it
    const [newPassword, setNewPassword] = useState(''); // State for the new password when changing it
    const [success, setSuccess] = useState(''); // Login success status

    const [authorized, setAuthorized] = useState(false); // Authorization status
    const [changingPassword, setChangingPassword] = useState(false); // Changing password status

    const [newSkill, setNewSkill] = useState(''); // Current skill input
    const [error, setError] = useState(''); // State for error messages
    const [editingJob, setEditingJob] = useState(null); // State for editing jobs

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
            const parsedJobs = data.map((job) => ({
                ...job,
                skills: typeof job.skills === 'string' ? JSON.parse(job.skills) : job.skills || [],
            }));
            setJobs(parsedJobs);
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

    // Add a new skill as a tag
    const addSkill = () => {
        if (newSkill.trim()) {
            setNewJob((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill(''); // Clear skill input
        }
    };

    // Remove a skill from the skills array
    const removeSkill = (index) => {
        setNewJob((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    // Add a new job
    const addJob = async () => {
        const { title, companyName, applicationDate, applicationStatus, skills } = newJob;

        if (!title || !companyName || !applicationDate || !applicationStatus) {
            alert('Please fill out all required fields before adding a job.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newJob, skills: JSON.stringify(skills) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add job');
            }

            const createdJob = await response.json();
            setJobs([...jobs, { ...createdJob, skills: JSON.parse(createdJob.skills) }]);
            setNewJob({
                companyName: '',
                title: '',
                applicationDate: '',
                applicationStatus: '',
                interviewDate: '',
                skills: [],
            });
        } catch (error) {
            console.error('Error adding job:', error.message);
            setError(error.message || 'Unable to add job. Please try again later.');
        }
    };

    // Start editing a job
    const startEditing = (job) => {
        setEditingJob(job.id);
        setNewJob(job); // Pre-fill form with job data
    };

    const updateJob = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${editingJob}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newJob,
                    skills: JSON.stringify(newJob.skills),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to edit job');
            }

            setJobs((prevJobs) =>
                prevJobs.map((job) =>
                    job.id === editingJob ? { ...job, ...newJob, skills: [...newJob.skills] } : job
                )
            );
            setEditingJob(null);
            setNewJob({
                companyName: '',
                title: '',
                applicationDate: '',
                applicationStatus: '',
                interviewDate: '',
                skills: [],
            });
        } catch (error) {
            setError('Unable to edit job. Please try again later.');
        }
    };

    const cancelEditing = () => {
        setEditingJob(null);
        setNewJob({
            companyName: '',
            title: '',
            applicationDate: '',
            applicationStatus: '',
            interviewDate: '',
            skills: [],
        });
    };

    // Function to delete a job
    const deleteJob = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job?');
        if (!confirmDelete) return;
   
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
                method: 'DELETE',
            });
   
            if (!response.ok) {
                const error = await response.json();


                if (response.status === 404) {
                    throw new Error('The job you are trying to delete does not exist');
                }


                throw new Error(error.error || 'Failed to delete job');
            }
   
            setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
            alert('Job deleted successfully!');
        } catch (error) {
            console.error('Error deleting job:', error.message);
            setError('Unable to delete job. Please try again later.');
        }
    };

    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();

            if (data.success) {
                setAuthorized(true);
                setPassword('');
            } else {
                setError('Invalid password. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    const handlePasswordChange = async () => {
        setError('');
        setSuccess('');

        if (!currentPassword || !newPassword) {
            setError('Both fields are required.');
            return;
        }

        try {
            const verifyResponse = await fetch('http://localhost:5000/api/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: currentPassword }),
            });
            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
                setError('Current password is incorrect.');
                return;
            }

            const updateResponse = await fetch('http://localhost:5000/api/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword }),
            });

            if (updateResponse.ok) {
                setSuccess('Password updated successfully.');
                setCurrentPassword('');
                setNewPassword('');
            } else {
                const updateData = await updateResponse.json();
                setError(updateData.error || 'Failed to update password.');
            }
        } catch (error) {
            console.error('Error during password change:', error);
            setError('Something went wrong. Please try again.');
        }
    };

    if (changingPassword) {
        return (
            <ChangePassword
                currentPassword={currentPassword}
                setCurrentPassword={setCurrentPassword}
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                handlePasswordChange={handlePasswordChange}
                setChangingPassword={setChangingPassword}
                error={error}
                success={success}
            />
        );
    }

    if (!authorized) {
        return (
            <Login
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                setChangingPassword={setChangingPassword}
                error={error}
            />
        );
    }

    return (
        <div className="container">
            <h1>Job Tracker</h1>
            {error && <div className="error-message">{error}</div>}
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
                <div>
                    <label>Skills:</label>
                    <div className="tag-input">
                        <input
                            type="text"
                            placeholder="Type a skill and click Add"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <button onClick={addSkill}>Add</button>
                    </div>
                    <div className="tags-container">
                        {newJob.skills.map((skill, index) => (
                            <span key={index} className="tag">
                                {skill}{' '}
                                <button onClick={() => removeSkill(index)}>✕</button>
                            </span>
                        ))}
                    </div>
                </div>
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

            <ul>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <span>
                            <strong>Company:</strong> {job.companyName}
                        </span>
                        <span>
                            <strong>Job Title:</strong> {job.title}
                        </span>
                        <span>
                            <strong>Application Date:</strong> {job.applicationDate}
                        </span>
                        <span>
                            <strong>Skills:</strong> {job.skills.join(', ')}
                        </span>
                        <span>
                            <strong>Status:</strong> {job.applicationStatus}
                        </span>
                        <span>
                            <strong>Interview Date:</strong> {job.interviewDate}
                        </span>
                        <button onClick={() => startEditing(job)}>Edit</button>
                        <button onClick={() => deleteJob(job.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
