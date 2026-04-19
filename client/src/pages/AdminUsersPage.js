import { useEffect, useState } from "react";
import {
  createUserByAdmin,
  deleteUserByAdmin,
  getAdminOverviewReport,
  getUsers
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reportLoading, setReportLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [report, setReport] = useState({
    totals: {
      totalIssues: 0,
      openIssues: 0,
      inProgressIssues: 0,
      closedIssues: 0,
      overdueIssues: 0,
      unassignedIssues: 0
    },
    userProgress: []
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const loadUsers = async () => {
    setError("");
    try {
      const response = await getUsers(token);
      setUsers(response);
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await getAdminOverviewReport(token);
      setReport(response);
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setReportLoading(false);
    }
  };

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    setError("");
    try {
      const createdUser = await createUserByAdmin(token, formData);
      setUsers((previousUsers) => [createdUser, ...previousUsers]);
      setFormData({ name: "", email: "", password: "" });
      await loadReport();
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    const isConfirmed = window.confirm("Delete this user?");
    if (!isConfirmed) {
      return;
    }

    setError("");
    try {
      await deleteUserByAdmin(token, userId);
      setUsers((previousUsers) => previousUsers.filter((user) => user._id !== userId));
      await loadReport();
    } catch (errorObject) {
      setError(errorObject.message);
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="card">
        <h2>Analytics</h2>
        {reportLoading ? (
          <p>Loading analytics...</p>
        ) : (
          <div className="analytics-grid">
            <div className="metric-card">
              <p>Total Issues</p>
              <h3>{report.totals.totalIssues}</h3>
            </div>
            <div className="metric-card">
              <p>Open</p>
              <h3>{report.totals.openIssues}</h3>
            </div>
            <div className="metric-card">
              <p>In Progress</p>
              <h3>{report.totals.inProgressIssues}</h3>
            </div>
            <div className="metric-card">
              <p>Closed</p>
              <h3>{report.totals.closedIssues}</h3>
            </div>
            <div className="metric-card">
              <p>Overdue</p>
              <h3>{report.totals.overdueIssues}</h3>
            </div>
            <div className="metric-card">
              <p>Unassigned</p>
              <h3>{report.totals.unassignedIssues}</h3>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h2>User Progress Report</h2>
        {reportLoading && <p>Loading report...</p>}
        {!reportLoading && report.userProgress.length === 0 && (
          <p>No user analytics available yet.</p>
        )}
        {!reportLoading && report.userProgress.length > 0 && (
          <div className="table-wrap">
            <table className="report-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Total Assigned</th>
                  <th>Open</th>
                  <th>In Progress</th>
                  <th>Closed</th>
                  <th>Overdue</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {report.userProgress.map((entry) => (
                  <tr key={entry.userId}>
                    <td>
                      <strong>{entry.name}</strong>
                      <br />
                      <span className="muted-text">{entry.email}</span>
                    </td>
                    <td>{entry.totalAssigned}</td>
                    <td>{entry.open}</td>
                    <td>{entry.inProgress}</td>
                    <td>{entry.closed}</td>
                    <td>{entry.overdue}</td>
                    <td>{entry.progressPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2>User List</h2>
        {loading && <p>Loading users...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && users.length === 0 && <p>No users found.</p>}

        <div className="project-list">
          {users.map((user) => (
            <div key={user._id} className="project-card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <small>Role: {user.role}</small>
              {user.role !== "admin" && (
                <div className="card-actions">
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete User
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>Create User</h2>
        <p className="muted-text">Only normal user accounts can be created here.</p>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Temporary password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button className="primary-button" type="submit" disabled={createLoading}>
            {createLoading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminUsersPage;
