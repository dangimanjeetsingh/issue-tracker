const express = require("express");
const { createProject, getProjects } = require("../controllers/projectController");

// Router helps us keep project routes in one place.
const router = express.Router();

// POST /api/projects -> create a new project.
router.post("/", createProject);

// GET /api/projects -> get all projects.
router.get("/", getProjects);

module.exports = router;

