import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import IssueCard from "../components/IssueCard";
import IssueForm from "../components/IssueForm";
import { getIssuesByProject, getUsers } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ProjectPage() {
  // id comes from the URL. It tells us which project's issues to load.
  const { id } = useParams();

  // location.state lets us receive data passed from the dashboard page.
  const location = useLocation();
  const { token, isAdmin } = useAuth();

  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // This function loads the issues of the selected project.
  const loadIssues = async () => {
    setError("");

    try {
      const issueList = await getIssuesByProject(token, id);
      setIssues(issueList);
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [id]);

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

  // Add the newly created issue at the top of the list.
  const handleIssueCreated = (newIssue) => {
    setIssues((previousIssues) => [newIssue, ...previousIssues]);
  };

  // Replace the old issue with the updated one after editing.
  const handleIssueUpdated = (updatedIssue) => {
    setIssues((previousIssues) =>
      previousIssues.map((issue) =>
        issue._id === updatedIssue._id ? updatedIssue : issue
      )
    );
  };
  const handleIssueDeleted = (issueId) => {
    setIssues((previousIssues) => previousIssues.filter((issue) => issue._id !== issueId));
  };
  const issueSummary = {
    total: issues.length,
    open: issues.filter((issue) => issue.status === "open").length,
    inProgress: issues.filter((issue) => issue.status === "in-progress").length,
    closed: issues.filter((issue) => issue.status === "closed").length
  };

  return (
    <div className="project-page-layout">
      <div className="page-top-bar">
        <div>
          <h1>{location.state?.projectTitle || "Project Issues"}</h1>
          <p className="muted-text">Project ID: {id}</p>
        </div>

        <Link to="/" className="back-link">
          Back to Dashboard
        </Link>
      </div>

      {isAdmin && (
        <IssueForm
          projectId={id}
          onIssueCreated={handleIssueCreated}
          token={token}
          isAdmin={isAdmin}
        />
      )}

      {!isAdmin && (
        <div className="card">
          <h2>My Progress In This Project</h2>
          <div className="analytics-grid">
            <div className="metric-card">
              <p>Assigned To Me</p>
              <h3>{issueSummary.total}</h3>
            </div>
            <div className="metric-card">
              <p>Open</p>
              <h3>{issueSummary.open}</h3>
            </div>
            <div className="metric-card">
              <p>In Progress</p>
              <h3>{issueSummary.inProgress}</h3>
            </div>
            <div className="metric-card">
              <p>Completed</p>
              <h3>{issueSummary.closed}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Issue List</h2>

        {loading && <p>Loading issues...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && issues.length === 0 && (
          <p>
            {isAdmin
              ? "No issues yet. Create the first issue for this project."
              : "No issues assigned to you in this project yet."}
          </p>
        )}

        <div className="issue-list">
          {issues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onIssueUpdated={handleIssueUpdated}
              onIssueDeleted={handleIssueDeleted}
              token={token}
              isAdmin={isAdmin}
              users={users}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
