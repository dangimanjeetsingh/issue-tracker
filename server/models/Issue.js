const mongoose = require("mongoose");

// This schema defines the structure for every issue in the database.
const issueSchema = new mongoose.Schema({
  // Issue title is required so that every issue has a short summary.
  title: {
    type: String,
    required: true,
    trim: true
  },

  // Issue description gives more details about the bug/task/feature.
  description: {
    type: String,
    trim: true
  },

  // Type tells us whether the issue is a bug, feature, or task.
  type: {
    type: String,
    enum: ["bug", "feature", "task"],
    default: "task"
  },

  // Priority tells us how urgent the issue is.
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },

  // Status tells us the current progress of the issue.
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
    default: "open"
  },

  // deadline is set by admin to track due date.
  deadline: {
    type: Date,
    default: null
  },

  // assignedTo points to a real user account.
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  // projectId connects this issue to one project.
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  }
});

// Export the model so other files can create and update issues.
module.exports = mongoose.model("Issue", issueSchema);

