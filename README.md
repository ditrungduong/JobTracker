# Job Tracker

Job Tracker is a web application that helps users manage their job applications. Users can view jobs, add new jobs, edit existing jobs, and delete jobs. The project consists of a backend for managing data and a frontend for user interaction.

---

## Features

- **View Jobs**: Display all job entries stored in the database.
- **Add Jobs**: Add new job entries with a title.
- **Edit Jobs**: Modify existing job titles.
- **Delete Jobs**: Remove job entries from the database.

---

## Project Structure

```plaintext
JobTracker/
├── backend/        # Node.js backend with SQLite database
│   ├── server.js   # Main server file
│   ├── database.js # SQLite database connection
│   └── package.json # Backend dependencies
├── frontend/       # React frontend for the UI
│   ├── src/        # React source files
│   │   ├── components/ # Reusable components
│   │   ├── App.js      # Main application file
│   │   └── App.css     # Styling for the app
│   └── package.json    # Frontend dependencies
└── README.md       # Project documentation
