# Mini Jira - MERN Issue Tracking Web Application

This is a simple **MERN stack Issue Tracking System** built for learning.

The main goal of this project is:

- Create projects
- Create issues inside a project
- Assign issues to a user by name
- Update issue status from `open` to `in-progress` to `closed`

The code is intentionally kept **simple, beginner-friendly, and well-commented** so that a student can explain it easily in an exam or viva.

## Tech Stack

- Frontend: React
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Styling: Basic CSS

## Folder Structure

```text
codex-test/
├── client/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   ├── IssueCard.js
│       │   ├── IssueForm.js
│       │   ├── Navbar.js
│       │   └── ProjectForm.js
│       ├── pages/
│       │   ├── Dashboard.js
│       │   └── ProjectPage.js
│       ├── services/
│       │   └── api.js
│       ├── App.css
│       ├── App.js
│       └── index.js
├── server/
│   ├── controllers/
│   │   ├── issueController.js
│   │   └── projectController.js
│   ├── models/
│   │   ├── Issue.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── issueRoutes.js
│   │   └── projectRoutes.js
│   ├── package.json
│   └── server.js
└── README.md
```

## How the Project Works

### 1. Backend flow

- `server.js` starts the Express server and connects to MongoDB.
- Routes receive API requests from the frontend.
- Controllers contain the main logic for creating, reading, and updating data.
- Models define the MongoDB structure using Mongoose.

### 2. Frontend flow

- React pages show the UI.
- Form components collect user input.
- `services/api.js` sends HTTP requests to the backend using `fetch`.
- After getting data from the backend, React updates the screen using `useState`.

### 3. Full data flow example

When the user creates a new issue:

1. The user fills the form in `IssueForm.js`
2. React stores form values in `useState`
3. On submit, `createIssue()` from `api.js` sends data to `POST /api/issues`
4. Express route receives the request
5. Controller saves the issue in MongoDB using the `Issue` model
6. The backend sends the saved issue back as JSON
7. React adds the new issue to the list without reloading the page

## Database Models

### Project

- `title`
- `description`
- `createdAt`

### Issue

- `title`
- `description`
- `type`
- `priority`
- `status`
- `assignedTo`
- `projectId`

## API Endpoints

### Project APIs

- `POST /api/projects` -> create project
- `GET /api/projects` -> get all projects

### Issue APIs

- `POST /api/issues` -> create issue
- `GET /api/issues/:projectId` -> get all issues for one project
- `PATCH /api/issues/:id` -> update issue status or assignment

## Setup Instructions

Before starting, make sure:

- Node.js is installed
- MongoDB is installed and running on your machine

### Backend setup

1. Open terminal in the `server` folder
2. Run:

```bash
npm install
```

3. Start the backend:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

### Frontend setup

1. Open a second terminal in the `client` folder
2. Run:

```bash
npm install
```

3. Start the frontend:

```bash
npm start
```

The frontend will run on:

```text
http://localhost:3000
```

## Running Summary

1. Start MongoDB
2. Run `npm install` inside `server`
3. Run `npm start` inside `server`
4. Run `npm install` inside `client`
5. Run `npm start` inside `client`

## Sample Data for Testing

### Sample Project

- Title: `College ERP`
- Description: `Track issues related to ERP development`

### Sample Issue

- Title: `Login button not working`
- Description: `The login button does not respond on click`
- Type: `bug`
- Priority: `high`
- Status: `open`
- Assigned To: `Manjeet`

## Manual Testing Checklist

### Test project creation

1. Open the dashboard
2. Create a project
3. Check whether the project appears in the project list

### Test issue creation

1. Open a project
2. Fill the issue form
3. Check whether the issue appears in the issue list

### Test issue update

1. Change the issue status from the dropdown
2. Change the assigned user name if needed
3. Click `Save Update`
4. Check whether the issue card shows the updated values

## Simple Viva Explanation

If asked to explain this project in a viva, you can say:

- This is a MERN stack issue tracking system
- React handles the frontend user interface
- Express and Node.js handle the backend APIs
- MongoDB stores the project and issue data
- Mongoose is used to create models for database documents
- The frontend calls the backend using `fetch`
- The backend sends JSON data back to the frontend
- React updates the UI using `useState` and `useEffect`

## Important Notes

- There is **no authentication** in this project
- `assignedTo` is just a text field
- The code focuses on **clarity and learning**, not advanced production features
- You can extend it later with delete buttons, filters, or authentication
