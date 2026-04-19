import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import AdminUsersPage from "./pages/AdminUsersPage";

function App() {
  return (
    <div className="app-shell">
      {/* Navbar is shown on all pages. */}
      <Navbar />

      <main className="page-container">
        {/* Routes decide which page component should be shown. */}
        <Routes>
          <Route path="/login/:role" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;

