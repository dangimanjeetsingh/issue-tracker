const API_BASE_URL = "http://localhost:5000/api";

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`
});

export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });
  return handleResponse(response);
};

export const getMyProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: authHeaders(token)
  });
  return handleResponse(response);
};

export const getUsers = async (token) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: authHeaders(token)
  });
  return handleResponse(response);
};

export const createUserByAdmin = async (token, userData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(userData)
  });
  return handleResponse(response);
};

export const deleteUserByAdmin = async (token, userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
  return handleResponse(response);
};

export const getAdminOverviewReport = async (token) => {
  const response = await fetch(`${API_BASE_URL}/reports/admin-overview`, {
    headers: authHeaders(token)
  });
  return handleResponse(response);
};

export const getProjects = async (token) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    headers: authHeaders(token)
  });
  return handleResponse(response);
};

export const createProject = async (token, projectData) => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(projectData)
  });
  return handleResponse(response);
};

export const deleteProject = async (token, projectId) => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
  return handleResponse(response);
};

export const getIssuesByProject = async (token, projectId) => {
  const response = await fetch(`${API_BASE_URL}/issues/${projectId}`, {
    headers: authHeaders(token)
  });
  return handleResponse(response);
};

export const createIssue = async (token, issueData) => {
  const response = await fetch(`${API_BASE_URL}/issues`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(issueData)
  });
  return handleResponse(response);
};

export const updateIssue = async (token, issueId, updatedData) => {
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(updatedData)
  });
  return handleResponse(response);
};

export const deleteIssue = async (token, issueId) => {
  const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
    method: "DELETE",
    headers: authHeaders(token)
  });
  return handleResponse(response);
};

