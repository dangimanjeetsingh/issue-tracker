import { useState } from "react";
import { deleteIssue, updateIssue } from "../services/api";

function IssueCard({ issue, onIssueUpdated, onIssueDeleted, token, isAdmin, users = [] }) {
  // Local state allows us to edit the fields before saving them.
  const [status, setStatus] = useState(issue.status);
  const [assignedTo, setAssignedTo] = useState(issue.assignedTo?._id || "");
  const [deadline, setDeadline] = useState(
    issue.deadline ? new Date(issue.deadline).toISOString().split("T")[0] : ""
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nextStatusByCurrent = {
    open: "in-progress",
    "in-progress": "closed",
    closed: "closed"
  };

  // Save the changed status or assignedTo value.
  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      const payload = isAdmin
        ? {
            status,
            assignedTo,
            deadline
          }
        : {
            status
          };
      const updatedIssue = await updateIssue(token, issue._id, payload);

      // Tell the parent component to replace the old issue with the updated one.
      onIssueUpdated(updatedIssue);
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm("Delete this issue?");
    if (!isConfirmed) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      await deleteIssue(token, issue._id);
      onIssueDeleted(issue._id);
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
          <strong>Assigned To:</strong> {issue.assignedTo?.name || "Unassigned"}
        </p>
        <p>
          <strong>Deadline:</strong>{" "}
          {issue.deadline ? new Date(issue.deadline).toLocaleDateString() : "No deadline"}
        </p>
      </div>

      <div className="issue-actions">
        {isAdmin ? (
          <>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            <select value={assignedTo} onChange={(event) => setAssignedTo(event.target.value)}>
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />

            <button className="secondary-button" onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Update"}
            </button>
            <button className="danger-button" onClick={handleDelete} disabled={loading}>
              Delete Issue
            </button>
          </>
        ) : (
          <>
            <p className="muted-text">Move your issue forward step-by-step.</p>
            <button
              className="secondary-button"
              onClick={() => {
                setStatus(nextStatusByCurrent[status]);
              }}
              disabled={loading || status === "closed"}
            >
              {status === "open"
                ? "Move to In Progress"
                : status === "in-progress"
                  ? "Mark as Completed"
                  : "Already Completed"}
            </button>
            <button
              className="primary-button"
              onClick={handleSave}
              disabled={loading || status === issue.status}
            >
              {loading ? "Updating..." : "Update My Status"}
            </button>
          </>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
    </div>
  );
}

export default IssueCard;
