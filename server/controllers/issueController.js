const Issue = require("../models/Issue");

// Create a new issue and save it in MongoDB.
const createIssue = async (req, res) => {
  try {
    // Create the issue using the data sent by the React form.
    const newIssue = new Issue({
      title: req.body.title,
      description: req.body.description,
      type: req.body.type,
      priority: req.body.priority,
      status: req.body.status,
      assignedTo: req.body.assignedTo,
      projectId: req.body.projectId
    });

    // Save the issue in the database.
    const savedIssue = await newIssue.save();

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

    // Find all issues whose projectId matches the selected project.
    const issues = await Issue.find({ projectId }).sort({ _id: -1 });

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

    // req.body can contain only the fields we want to update
    // such as status, assignedTo, priority, or description.
    const updatedIssue = await Issue.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    // If no issue is found with that id, return 404.
    if (!updatedIssue) {
      return res.status(404).json({ message: "Issue not found." });
    }

    // Send the updated issue back to the frontend.
    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: "Unable to update issue.", error: error.message });
  }
};

module.exports = {
  createIssue,
  getIssuesByProject,
  updateIssue
};

