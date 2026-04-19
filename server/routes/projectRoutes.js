const express = require("express");
const { createProject, getProjects, deleteProject } = require("../controllers/projectController");
const { authenticate, requireRole } = require("../middleware/authMiddleware");

// Router helps us keep project routes in one place.
const router = express.Router();

// POST /api/projects -> create a new project.
router.post("/", authenticate, requireRole("admin"), createProject);

// GET /api/projects -> get all projects.
router.get("/", authenticate, getProjects);

// DELETE /api/projects/:id -> delete a project.
router.delete("/:id", authenticate, requireRole("admin"), deleteProject);

module.exports = router;

