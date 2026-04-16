import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectForm from "../components/ProjectForm";
import { getProjects } from "../services/api";

function Dashboard() {
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
      const projectList = await getProjects();
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

  return (
    <div className="dashboard-layout">
      <ProjectForm onProjectCreated={handleProjectCreated} />

      <div className="card">
        <h2>All Projects</h2>

        {loading && <p>Loading projects...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && projects.length === 0 && (
          <p>No projects yet. Create your first project from the form.</p>
        )}

        <div className="project-list">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/project/${project._id}`}
              state={{ projectTitle: project.title }}
              className="project-card"
            >
              <h3>{project.title}</h3>
              <p>{project.description || "No description added."}</p>
              <small>
                Created on {new Date(project.createdAt).toLocaleDateString()}
              </small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
