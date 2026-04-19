const Issue = require("../models/Issue");
const User = require("../models/User");
const STATUS_ORDER = ["open", "in-progress", "closed"];

const normalizeStatus = (rawStatus) => {
  if (typeof rawStatus !== "string") {
    return rawStatus;
  }
  const normalized = rawStatus.trim().toLowerCase();
  if (normalized === "in progress" || normalized === "inprogress") {
    return "in-progress";
  }
  return normalized;
};

// Create a new issue and save it in MongoDB.
const createIssue = async (req, res) => {
  try {
    const assignedTo = req.body.assignedTo || null;
    if (assignedTo) {
      const assignee = await User.findById(assignedTo);
      if (!assignee) {
        return res.status(400).json({ message: "Assigned user does not exist." });
      }
    }

    // Create the issue using the data sent by the React form.
    const newIssue = new Issue({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      priority: req.body.priority,
      status: normalizeStatus(req.body.status),
      deadline: req.body.deadline || null,
      assignedTo,
      projectId: req.body.projectId
    });

    // Save the issue in the database.
    const savedIssue = await newIssue.save();
    await savedIssue.populate("assignedTo", "name email role");

    // Return the saved issue to the frontend.
    res.status(201).json(savedIssue);
  } catch (error) {
    res.status(500).json({ message: "Unable to create issue.", error: error.message });
  }
};

// Get all issues that belong to one project.
const getIssuesByProject = async (req, res) => {
  try {
    // projectId comes from the URL parameter.
    const { projectId } = req.params;
    const filters = { projectId };

    // Normal users should only see issues assigned to themselves.
    if (req.user.role === "user") {
      filters.assignedTo = req.user.userId;
    }

    // Find all issues whose projectId matches the selected project.
    const issues = await Issue.find(filters)
      .populate("assignedTo", "name email role")
      .sort({ _id: -1 });

    // Send the project issues back to the frontend.
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch issues.", error: error.message });
  }
};

// Update an existing issue.
const updateIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const existingIssue = await Issue.findById(id);
    if (!existingIssue) {
      return res.status(404).json({ message: "Issue not found." });
    }

    // Users can only update their own assigned issues.
    if (req.user.role === "user") {
      if (!existingIssue.assignedTo || existingIssue.assignedTo.toString() !== req.user.userId) {
        return res.status(403).json({ message: "You can only update issues assigned to you." });
      }
    }

    const updatePayload = { ...req.body };
    if ("status" in updatePayload) {
      updatePayload.status = normalizeStatus(updatePayload.status);
    }

    // User accounts can only update status.
    if (req.user.role === "user") {
      const allowedKeys = ["status"];
      const requestedKeys = Object.keys(updatePayload);
      const hasInvalidField = requestedKeys.some((key) => !allowedKeys.includes(key));
      if (hasInvalidField) {
        return res.status(403).json({ message: "Users can only update issue status." });
      }
    }

    if ("assignedTo" in updatePayload && !updatePayload.assignedTo) {
      updatePayload.assignedTo = null;
    }
    if ("deadline" in updatePayload && !updatePayload.deadline) {
      updatePayload.deadline = null;
    }

    if (updatePayload.assignedTo) {
      const assignee = await User.findById(updatePayload.assignedTo);
      if (!assignee) {
        return res.status(400).json({ message: "Assigned user does not exist." });
      }
    }

    // Enforce forward-only status transitions: open -> in-progress -> closed.
    if ("status" in updatePayload) {
      const currentIndex = STATUS_ORDER.indexOf(existingIssue.status);
      const nextIndex = STATUS_ORDER.indexOf(updatePayload.status);
      if (nextIndex === -1) {
        return res.status(400).json({ message: "Invalid status value." });
      }
      if (nextIndex < currentIndex) {
        return res.status(400).json({ message: "Status cannot move backwards." });
      }
      if (nextIndex > currentIndex + 1) {
        return res.status(400).json({ message: "Status must move step-by-step." });
      }
    }

    // req.body can contain only the fields we want to update
    // such as status, assignedTo, priority, or description.
    const updatedIssue = await Issue.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true
    }).populate("assignedTo", "name email role");

    // Send the updated issue back to the frontend.
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: "Unable to update issue.", error: error.message });
  }
};

const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIssue = await Issue.findByIdAndDelete(id);
    if (!deletedIssue) {
      return res.status(404).json({ message: "Issue not found." });
    }

    res.json({ message: "Issue deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete issue.", error: error.message });
  }
};

module.exports = {
  createIssue,
  getIssuesByProject,
  updateIssue,
  deleteIssue
};

