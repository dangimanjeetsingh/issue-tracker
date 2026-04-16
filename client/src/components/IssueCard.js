import { useState } from "react";
import { updateIssue } from "../services/api";

function IssueCard({ issue, onIssueUpdated }) {
  // Local state allows us to edit the fields before saving them.
  const [status, setStatus] = useState(issue.status);
  const [assignedTo, setAssignedTo] = useState(issue.assignedTo || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Save the changed status or assignedTo value.
  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const updatedIssue = await updateIssue(issue._id, {
        status,
        assignedTo
      });

      // Tell the parent component to replace the old issue with the updated one.
      onIssueUpdated(updatedIssue);
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="issue-card">
      <div className="issue-header">
        <h3>{issue.title}</h3>
        <span className={`status-badge status-${status}`}>
          {status === "in-progress" ? "In Progress" : status}
        </span>
      </div>

      <p className="issue-description">{issue.description || "No description added."}</p>

      <div className="issue-meta">
        <p>
          <strong>Type:</strong> {issue.type}
        </p>
        <p>
          <strong>Priority:</strong> {issue.priority}
        </p>
        <p>
          <strong>Assigned To:</strong> {issue.assignedTo || "Unassigned"}
        </p>
      </div>

      <div className="issue-actions">
        {/* The user can change the status from this dropdown. */}
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="closed">Closed</option>
        </select>

        {/* This input allows quick reassignment of the issue. */}
        <input
          type="text"
          value={assignedTo}
          onChange={(event) => setAssignedTo(event.target.value)}
          placeholder="Assign to user"
        />

        <button className="secondary-button" onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Update"}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default IssueCard;
