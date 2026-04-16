const Project = require("../models/Project");

// Create a new project and save it in MongoDB.
const createProject = async (req, res) => {
  try {
    // Create a new Project object using the data sent by the frontend.
    const newProject = new Project({
      title: req.body.title,
      description: req.body.description
    });

    // Save the project in the database.
    const savedProject = await newProject.save();

    // Send the saved project back to the frontend.
    res.status(201).json(savedProject);
  } catch (error) {
    // If something goes wrong, send an error message.
    res.status(500).json({ message: "Unable to create project.", error: error.message });
  }
};

// Get all projects from MongoDB.
const getProjects = async (req, res) => {
  try {
    // Sort by newest project first so the latest project appears at the top.
    const projects = await Project.find().sort({ createdAt: -1 });

    // Send the array of projects to the frontend.
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch projects.", error: error.message });
  }
};

module.exports = {
  createProject,
  getProjects
};

