import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Clicking the title always takes the user back to the dashboard. */}
        <Link to="/" className="brand-link">
          Mini Jira - Issue Tracker
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

