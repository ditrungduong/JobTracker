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
        contact_name: '',
        contact_email: '',
        contact_phone: ''
    });

    const [password, setPassword] = useState(''); // State for the login password
    const [currentPassword, setCurrentPassword] = useState(''); // State for the current password when changing it
    const [newPassword, setNewPassword] = useState(''); // State for the new password when changing it
    const [success, setSuccess] = useState(''); // Login success status

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [authorized, setAuthorized] = useState(false); // Authorization status
    const [changingPassword, setChangingPassword] = useState(false); // Changing password status
    const [isRegistering, setIsRegistering] = useState(false);

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

    // Skill percentage analysis
    const skillCounts = (jobs) => {
        const totalJobs = jobs.length;
        const skillMap = {};
    
        jobs.forEach((job) => {
            job.skills.forEach((skill) => {
                const normalizedSkill = skill.toLowerCase(); // Normalize skill to lowercase
                skillMap[normalizedSkill] = (skillMap[normalizedSkill] || 0) + 1;
            });
        });
    
        // Calculate percentage and in-demand status
        const result = {};
        for (const [skill, count] of Object.entries(skillMap)) {
            const percentage = ((count / totalJobs) * 100).toFixed(2); // Round to 2 decimal places
            result[skill] = {
                percentage,
                inDemand: percentage >= 50, // Check if the skill is in demand
            };
        }
    
        return result;
    };

    // Add a new job
    const addJob = async () => {
        const { 
            title, companyName, applicationDate, applicationStatus, interviewDate, 
            skills, contact_name, contact_email, contact_phone 
        } = newJob;
    
        if (!title || !companyName || !applicationDate || !applicationStatus) {
            alert('Please fill out all required fields before adding a job.');
            return;
        }
    
        const jobData = {
            title, 
            companyName, 
            applicationDate, 
            applicationStatus, 
            interviewDate: interviewDate || null, 
            skills: JSON.stringify(skills || []),
            contact_name: contact_name || "", 
            contact_email: contact_email || "", 
            contact_phone: contact_phone || ""
        };
    
        // Debugging: Log the exact job object being sent
        console.log("Sending job to backend:", jobData);
    
        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add job');
            }
    
            const createdJob = await response.json();
            console.log("Received response from backend:", createdJob);
    
            setJobs([...jobs, { 
                ...createdJob, 
                skills: JSON.parse(createdJob.skills),
                contact_name: createdJob.contact_name,
                contact_email: createdJob.contact_email,
                contact_phone: createdJob.contact_phone
            }]);
    
            setNewJob({
                companyName: '',
                title: '',
                applicationDate: '',
                applicationStatus: '',
                interviewDate: '',
                skills: [],
                contact_name: '',
                contact_email: '',
                contact_phone: ''
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

    // Login a user
    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setAuthorized(true);
                setPassword('');
                setEmail('');
            } else {
                setError(data.error || 'Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    // Register a user
    const handleRegister = async () => {
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert('Registration successful! You can now log in.');
                setIsRegistering(false); // Switch back to login mode
                setUsername('');
                setEmail('');
                setPassword('');
            } else {
                setError(data.error || 'Registration failed. Try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    // Logout a user
    const handleLogout = () => {
        setAuthorized(false); 
    };    

    // Change a user's password
    const handlePasswordChange = async () => {
        setError('');
        setSuccess('');
    
        if (!email || !currentPassword || !newPassword) {
            setError('All fields are required.');
            return;
        }
    
        try {
            const verifyResponse = await fetch('http://localhost:5000/api/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: currentPassword }),
            });
    
            const verifyData = await verifyResponse.json();
    
            if (!verifyResponse.ok || !verifyData.success) {
                setError('Incorrect email or current password.');
                return;
            }
    
            const updateResponse = await fetch('http://localhost:5000/api/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: newPassword }),
            });
    
            if (updateResponse.ok) {
                setSuccess('Password updated successfully.');
                setEmail('');
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
                email={email}
                setEmail={setEmail}
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
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                username={username}
                setUsername={setUsername}
                handleLogin={handleLogin}
                handleRegister={handleRegister}
                setChangingPassword={setChangingPassword}
                isRegistering={isRegistering}
                setIsRegistering={setIsRegistering}
                error={error}
            />
        );
    }

    return (
        <div className="container">
            <div className="logout-container">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
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
                <input
                    type="text"
                    name="contact_name"
                    value={newJob.contact_name}
                    onChange={handleInputChange}
                    placeholder="Contact Name"
                />
                <input
                    type="email"
                    name="contact_email"
                    value={newJob.contact_email}
                    onChange={handleInputChange}
                    placeholder="Contact Email"
                />
                <input
                    type="tel"
                    name="contact_phone"
                    value={newJob.contact_phone}
                    onChange={handleInputChange}
                    placeholder="Contact Phone"
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
                    <li key={job.id} className="job-container">
                        <div className="job-details">
                            <span><strong>Company:</strong> {job.companyName}</span>
                            <span><strong>Job Title:</strong> {job.title}</span>
                            <span><strong>Application Date:</strong> {job.applicationDate}</span>
                            <span><strong>Skills:</strong> {job.skills.join(', ')}</span>
                            <span><strong>Status:</strong> {job.applicationStatus}</span>
                            <span><strong>Interview Date:</strong> {job.interviewDate}</span>

                            {/* Buttons must remain at the end of the row */}
                            <div className="job-buttons">
                                <button onClick={() => startEditing(job)}>Edit</button>
                                <button onClick={() => deleteJob(job.id)}>Delete</button>
                            </div>
                        </div>

                        {/* Contact details should appear in a new row */}
                        {job.contact_name && (
                            <div className="contact-details">
                                <span><strong>Contact Name:</strong> {job.contact_name}</span>
                                <span><strong>Contact Email:</strong> {job.contact_email}</span>
                                <span><strong>Contact Phone:</strong> {job.contact_phone}</span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>

            {/* Skill Analysis Section */}
            <div className="skill-analysis">
                <h2>Skill Analysis</h2>
                <ul>
                    {Object.entries(skillCounts(jobs)).map(([skill, { percentage, inDemand }]) => (
                        <li key={skill}>
                            <strong>{skill}:{inDemand && <span className="in-demand">This is an in-demand skill</span>}</strong> {percentage}%{' '}
                            
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
