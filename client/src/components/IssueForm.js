import { useEffect, useState } from "react";
import { createIssue, getUsers } from "../services/api";

function IssueForm({ projectId, onIssueCreated, token, isAdmin }) {
  // This state stores the values of all issue form fields.
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "bug",
    priority: "medium",
    status: "open",
    assignedTo: "",
    deadline: ""
  });
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const loadUsers = async () => {
      if (!isAdmin) {
        return;
      }
      try {
        const userList = await getUsers(token);
        setUsers(userList.filter((user) => user.role === "user"));
      } catch (errorObject) {
        setError(errorObject.message);
      }
    };

    loadUsers();
  }, [token, isAdmin]);


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
    if (!isAdmin) {
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Add projectId so the backend knows which project this issue belongs to.
      const issueData = {
        ...formData,
        projectId
      };

      const savedIssue = await createIssue(token, issueData);
      onIssueCreated(savedIssue);

      // Reset the form after a successful issue creation.
      setFormData({
        title: "",
        description: "",
        type: "bug",
        priority: "medium",
        status: "open",
        assignedTo: "",
        deadline: ""
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
      {!isAdmin && (
        <p className="muted-text">Only admin can create and assign issues.</p>
      )}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="title"
          placeholder="Issue title"
          value={formData.title}
          onChange={handleChange}
          required
          disabled={!isAdmin}
        />

        <textarea
          name="description"
          placeholder="Issue description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          disabled={!isAdmin}
        />

        <select name="type" value={formData.type} onChange={handleChange} disabled={!isAdmin}>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="task">Task</option>
        </select>

        <select name="priority" value={formData.priority} onChange={handleChange} disabled={!isAdmin}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange} disabled={!isAdmin}>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        <select
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          disabled={!isAdmin}
        >
          <option value="">Unassigned</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
          disabled={!isAdmin}
        />

        <button type="submit" className="primary-button" disabled={loading || !isAdmin}>
          {loading ? "Creating..." : "Create Issue"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}

export default IssueForm;

