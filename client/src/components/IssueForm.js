import { useState } from "react";
import { createIssue } from "../services/api";

function IssueForm({ projectId, onIssueCreated }) {
  // This state stores the values of all issue form fields.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "bug",
    priority: "medium",
    status: "open",
    assignedTo: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update the matching field whenever the user types or selects an option.
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  // Send the issue data to the backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Add projectId so the backend knows which project this issue belongs to.
      const issueData = {
        ...formData,
        projectId
      };

      const savedIssue = await createIssue(issueData);
      onIssueCreated(savedIssue);

      // Reset the form after a successful issue creation.
      setFormData({
        title: "",
        description: "",
        type: "bug",
        priority: "medium",
        status: "open",
        assignedTo: ""
      });
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create Issue</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="title"
          placeholder="Issue title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Issue description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />

        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="task">Task</option>
        </select>

        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <input
          type="text"
          name="assignedTo"
          placeholder="Assigned to"
          value={formData.assignedTo}
          onChange={handleChange}
        />

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating..." : "Create Issue"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}

export default IssueForm;

