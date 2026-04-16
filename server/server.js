// Import the libraries we need to create the backend server.
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import route files so we can separate project routes and issue routes.
const projectRoutes = require("./routes/projectRoutes");
const issueRoutes = require("./routes/issueRoutes");

// Create the Express application.
const app = express();

// This is the port where our backend will run.
const PORT = 5000;

// This is the local MongoDB connection string.
// Students can change the database name if they want to create a new database.
const MONGO_URL = "mongodb://127.0.0.1:27017/mini-jira";

// Enable CORS so the React frontend can call this backend.
app.use(cors());

// Convert JSON data from the frontend into JavaScript objects.
app.use(express.json());

// A small test route to check whether the server is running.
app.get("/", (req, res) => {
  res.send("Mini Jira backend is running.");
});

// All project APIs will start with /api/projects.
app.use("/api/projects", projectRoutes);

// All issue APIs will start with /api/issues.
app.use("/api/issues", issueRoutes);

// Connect to MongoDB first, then start the server.
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

