import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { deleteProject, getProjects } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { token, isAdmin } = useAuth();
  // projects stores the project list fetched from the backend.
  const [projects, setProjects] = useState([]);

  // loading helps us show the user that data is being fetched.
  const [loading, setLoading] = useState(true);

  // error stores an error message if the API fails.
  const [error, setError] = useState("");

  // This function gets all projects from the backend.
  const loadProjects = async () => {
    setError("");

    try {
      const projectList = await getProjects(token);
      setProjects(projectList);
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect runs once when the page first loads.
  useEffect(() => {
    loadProjects();
  }, []);

  // Add the new project at the top without refreshing the page.
  const handleProjectCreated = (newProject) => {
    setProjects((previousProjects) => [newProject, ...previousProjects]);
  };

  const handleDeleteProject = async (projectId) => {
    const isConfirmed = window.confirm("Delete this project and all its issues?");
    if (!isConfirmed) {
      return;
    }

    try {
      await deleteProject(token, projectId);
      setProjects((previousProjects) => previousProjects.filter((project) => project._id !== projectId));
    } catch (errorObject) {
      setError(errorObject.message);
    }
  };

  return (
    <div className="dashboard-layout">
      {isAdmin && (
        <ProjectForm onProjectCreated={handleProjectCreated} token={token} isAdmin={isAdmin} />
      )}
      {!isAdmin && (
        <div className="card">
          <p className="muted-text">
            You are logged in as a user. You can view projects and only issues assigned to you.
          </p>
        </div>
      )}

      <div className="card">
        <h2>All Projects</h2>

        {loading && <p>Loading projects...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && projects.length === 0 && <p>No projects available yet.</p>}

        <div className="project-list">
          {projects.map((project) => (
            <div key={project._id} className="project-card">
              <Link to={`/project/${project._id}`} state={{ projectTitle: project.title }}>
                <h3>{project.title}</h3>
                <p>{project.description || "No description added."}</p>
                <small>
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </small>
              </Link>
              {isAdmin && (
                <div className="card-actions">
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    Delete Project
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
