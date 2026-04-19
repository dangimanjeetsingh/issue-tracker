const express = require("express");
const {
  createIssue,
  getIssuesByProject,
  updateIssue,
  deleteIssue
} = require("../controllers/issueController");
const { authenticate, requireRole } = require("../middleware/authMiddleware");

// Router for issue-related APIs.
const router = express.Router();

// POST /api/issues -> create a new issue.
router.post("/", authenticate, requireRole("admin"), createIssue);

// GET /api/issues/:projectId -> get all issues of one project.
router.get("/:projectId", authenticate, getIssuesByProject);

// PATCH /api/issues/:id -> update an issue.
router.patch("/:id", authenticate, updateIssue);

// DELETE /api/issues/:id -> delete an issue.
router.delete("/:id", authenticate, requireRole("admin"), deleteIssue);

module.exports = router;
