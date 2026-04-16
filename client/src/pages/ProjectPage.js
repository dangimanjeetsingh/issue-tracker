import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import IssueCard from "../components/IssueCard";
import IssueForm from "../components/IssueForm";
import { getIssuesByProject } from "../services/api";

function ProjectPage() {
  // id comes from the URL. It tells us which project's issues to load.
  const { id } = useParams();

  // location.state lets us receive data passed from the dashboard page.
  const location = useLocation();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // This function loads the issues of the selected project.
  const loadIssues = async () => {
    setError("");

    try {
      const issueList = await getIssuesByProject(id);
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

      <IssueForm projectId={id} onIssueCreated={handleIssueCreated} />

      <div className="card">
        <h2>Issue List</h2>

        {loading && <p>Loading issues...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && issues.length === 0 && (
          <p>No issues yet. Create the first issue for this project.</p>
        )}

        <div className="issue-list">
          {issues.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onIssueUpdated={handleIssueUpdated}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
