import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import trackishLogo from "../assets/trackish-logo.svg";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-content navbar-row">
        <Link to="/" className="brand-link">
          <img src={trackishLogo} alt="Trackish logo" className="brand-logo" />
          <span>Trackish</span>
        </Link>
        <div className="nav-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login/user">User Login</Link>
              <Link to="/login/admin">Admin Login</Link>
              <Link to="/signup">Create Account</Link>
            </>
          ) : (
            <>
              {isAdmin ? (
                <>
                  <Link to="/">Dashboard</Link>
                  <Link to="/admin/users">Users</Link>
                </>
              ) : null}
              <span className="user-pill">
                {user?.name} ({user?.role})
              </span>
              <button type="button" onClick={logout} className="secondary-button">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

