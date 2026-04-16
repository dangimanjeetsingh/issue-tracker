const express = require("express");
const {
  createIssue,
  getIssuesByProject,
  updateIssue
} = require("../controllers/issueController");

// Router for issue-related APIs.
const router = express.Router();

// POST /api/issues -> create a new issue.
router.post("/", createIssue);

// GET /api/issues/:projectId -> get all issues of one project.
router.get("/:projectId", getIssuesByProject);

// PATCH /api/issues/:id -> update an issue.
router.patch("/:id", updateIssue);

module.exports = router;
