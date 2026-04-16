import { useState } from "react";
import { createProject } from "../services/api";

function ProjectForm({ onProjectCreated }) {
  // formData stores everything the user types in the form.
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });

  // loading helps us show a disabled button while the request is running.
  const [loading, setLoading] = useState(false);

  // error stores a message if the API request fails.
  const [error, setError] = useState("");

  // This function runs whenever the user types in any input.
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  // This function sends the new project to the backend.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      // API call: frontend -> backend -> database.
      const savedProject = await createProject(formData);

      // Tell the parent page that a new project has been created.
      onProjectCreated(savedProject);

      // Clear the form after successful submission.
      setFormData({
        title: "",
        description: ""
      });
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Create Project</h2>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="title"
          placeholder="Project title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Project description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}

export default ProjectForm;

