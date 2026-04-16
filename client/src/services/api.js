// This is the common base URL for all backend API calls.
const API_BASE_URL = "http://localhost:5000/api";

// This helper converts the fetch response into JSON
// and throws an error when the request fails.
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

// Get all projects from the backend.
export const getProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/projects`);
  return handleResponse(response);
};

// Send project data to the backend to create a new project.
export const createProject = async (projectData) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(projectData)
  });

  return handleResponse(response);
};

// Get all issues of one project.
export const getIssuesByProject = async (projectId) => {
  const response = await fetch(`${API_BASE_URL}/issues/${projectId}`);
  return handleResponse(response);
};

// Send issue data to the backend to create a new issue.
export const createIssue = async (issueData) => {
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(issueData)
  });

  return handleResponse(response);
};

// Update an issue by sending only the fields we want to change.
export const updateIssue = async (issueId, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedData)
  });

  return handleResponse(response);
};

