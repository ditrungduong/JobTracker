# Backend Setup for Job Tracker

## Overview
This backend provides the server, database, and seeding scripts for the Job Tracker application. Follow these steps to set up the project on your local machine.

---

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (version 14 or higher recommended)
- **npm** (Node Package Manager)

---

## Installation Steps

1. **Clone the Repository**  
   Clone the project repository to your local machine:
   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. **Install Dependencies**  
   Run the following command to install the required dependencies:
   ```bash
   npm install

3. **Rebuild SQLite3**  
   Rebuild the SQLite3 package to ensure compatibility with your system:
   ```bash
   npm rebuild sqlite3

4. **Initialize the Database**  
   Set up the database schema by running the database.js script:
   ```bash
   node database.js

5. **Seed the Database**  
   Populate the database with initial data (jobs and a default password):
   ```bash
   node seedTables.js

6. **Start the Server**  
   Run the server.js file to start the backend server:
   ```bash
   node server.js

---

## Usage

### Access the Server
The server will run on http://localhost:5000 by default. Make sure your frontend is configured to interact with this backend.

### Endpoints Overview
GET /api/jobs: Fetch all jobs.
POST /api/jobs: Add a new job.
PUT /api/jobs/:id: Update a job by ID.
DELETE /api/jobs/:id: Delete a job by ID.
POST /api/verify-password: Verify the user's password.
PUT /api/password: Update the user's password.

### Notes
The default password is set to abc123. Change it after setup for security.
Ensure the jobs.db file is in the same directory as the scripts.