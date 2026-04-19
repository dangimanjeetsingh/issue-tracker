import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const expectedRole = role === "admin" ? "admin" : "user";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData);
      if (response.user.role !== expectedRole) {
        setError(`This account is not an ${expectedRole} account.`);
        return;
      }

      login(response);
      navigate("/");
    } catch (errorObject) {
      setError(errorObject.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="card auth-card">
        <h2>{expectedRole === "admin" ? "Admin Login" : "User Login"}</h2>
        <p className="muted-text">
          Login using your registered email and password.
        </p>

        <form onSubmit={handleSubmit} className="form">
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
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && <p className="error-text">{error}</p>}

        {expectedRole === "user" ? (
          <p className="small-text">
            New user? <Link to="/signup">Create account</Link> | Admin?{" "}
            <Link to="/login/admin">Admin login</Link>
          </p>
        ) : (
          <p className="small-text">
            Team member? <Link to="/login/user">User login</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
